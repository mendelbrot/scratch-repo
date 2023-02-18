import config
import logging
import json
from pymongo import MongoClient, UpdateOne
from pymongo.errors import BulkWriteError, WriteError # insert_many with ordered=False raises error even though successful
# (the BulkWriteError usually means one of them was an existing record)

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

def auth_mongo():
  db_url = config.env['DATABASE']['url']
  if not db_url:
    raise Exception('no database url was loaded from secrets')
  client = MongoClient(db_url)
  db = client[config.env['DATABASE']['name']]
  return db

def find_user(user_email, db):
  response = db.get_collection('users').find_one({'_id': user_email})
  return response

def get_users(db):
  response = db.get_collection('users').find()
  return list(response)

# def add_users(user_emails, db):
#   try:
#     if user_emails:
#       response = db.get_collection('users').insert_many(
#         [{'_id': e} for e in user_emails],
#         ordered=False
#       )
#       return response
#   except BulkWriteError as error:
#     return error.details

# def remove_users(user_emails, db):
#   if user_emails:
#     response = db.get_collection('users').delete_many(
#       {'_id': {'$in': user_emails}}
#     )
#     return response

def get_excluded_addresses(user_email, db):
  response = list(db.get_collection(user_email + '.excluded_addresses').find())
  return [ item['_id'] for item in response ]

def get_excluded_domains(db):
  response = list(db.get_collection('excluded_domains').find())
  return [ item['_id'] for item in response ]

def add_excluded_addresses(email_addresses, user_email, db):
  try:
    if email_addresses:
      response = db.get_collection(user_email + '.excluded_addresses').insert_many(
        [{'_id': e} for e in email_addresses],
        ordered=False
      )
      return { 'response': response, 'error': None }
  except BulkWriteError as error:
    return { 'response': None, 'error': error }

def remove_excluded_addresses(email_addresses, user_email, db):
  if email_addresses:
    response = db.get_collection(user_email + '.excluded_addresses').delete_many(
      {'_id': {'$in': email_addresses}}
    )
    return response

def get_most_recent_email_message(user_email, db):
  response = db.get_collection(user_email + '.email_messages').find_one(
    sort=[('date', -1)]
  )
  return response

def add_email_messages(messages, user_email, db):
  try:
    if messages:
      response = db.get_collection(user_email + '.email_messages').insert_many(
        [{
          '_id': m['message_id'],
          'thread_id': m.get('threadId'),
          'date': m.get('date'), 
          'headers': m.get('headers')
        } for m in messages],
        ordered=False
      )
      return { 'response': response, 'error': None }
  except BulkWriteError as error:
    return { 'response': None, 'error': error }

def get_suggested_leads(user_email, db, before, limit):
  filter = {'last_contact_date': {'$lt': before }} if before else None
  response = db.get_collection(user_email + '.suggested_leads') \
    .find(filter) \
    .sort('last_contact_date', -1) \
    .limit(limit)
  return response

def update_suggested_leads(suggested_leads, user_email, db):
  try:
    if suggested_leads:
      requests = [UpdateOne(
        {'_id': sl['email']}, # filter
        { # update
          '$set': {
            '_id': sl['email'],
            'title': sl.get('title'),
            'first_name': sl.get('first_name'),
            'last_name': sl.get('last_name'),
            'last_contact_date': sl.get('last_contact_date')
          },
          '$addToSet': {
            'email_message_ids': {'$each': sl.get('email_message_ids', [])}
          }
        },
        upsert=True
      ) for sl in suggested_leads]
      response = db.get_collection(user_email + '.suggested_leads').bulk_write(requests, ordered=False)
      return { 'response': response, 'error': None }
  except BulkWriteError as error:
    return { 'response': None, 'error': error }

def remove_suggested_leads(email_addresses, user_email, db):
  if email_addresses:
    response = db.get_collection(user_email + '.suggested_leads').delete_many(
      {'_id': {'$in': email_addresses}}
    )
    return response

def remove_old_suggested_leads(remove_before_time, user_emails, db):
  for email in user_emails:
    try:
      db.get_collection(email + '.suggested_leads').delete_many(
        {'last_contact_date': {'$lt': remove_before_time}}
      )
    except:
      logger.warning(f'{email}: remove old suggested leads failed')
  return

def enrich_suggested_leads(data, user_email, db):
  ''' add data to suggested leads (identified by email in data list)
      do not create record if the email isn't found
  '''
  try:
    if data:
      requests = []
      for item in data:
        # skip to next if no email present in data
        if not item.get('email', None):
          continue
        # add the _id used by mongo and remove the email
        item['_id'] = item['email']
        del item['email']
        r = UpdateOne(
          {'_id': item['_id']}, # filter
          {
            '$set': item,
          },
          upsert=False
        )
        requests.append(r)
      response = db.get_collection(user_email + '.suggested_leads').bulk_write(requests, ordered=False)
      return { 'response': response, 'error': None }
  except BulkWriteError as error:
    return { 'response': None, 'error': error }

def drop_suggested_leads_and_email_messages(user_email, db):
  db.get_collection(user_email + '.suggested_leads').drop()
  db.get_collection(user_email + '.email_messages').drop()

def get_email_providers(db):
  response = db.get_collection('email_providers').find()
  return response