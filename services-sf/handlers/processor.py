import logging 
import time
from services import mongo, email_data, company_data

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

def enrich_data(user_email, emails, db):
  ''' calls other functions to add mor data to the suggested leads.

  Currently it:
  * adds the company names looked up from email domains
  '''

  company_data.add_company_names(user_email, emails, db)

def perform_action(action, user_email, event, db):
  '''Switch determining which action is performed next
  '''
  logger.info('action: {0}, user: {1}'.format(action, user_email))

  if action == 'reset_sl':
    mongo.drop_suggested_leads_and_email_messages(user_email, db)

  if action == 'run_sl':
    email_data.update_suggested_leads(user_email, db)
  
  if action == 'enrich_data':
    emails = event['emails']
    enrich_data(user_email, emails, db)

def main(event, context):
  '''Processor does different things depending on the event input.

  Current actions:
  * reset_sl: drop suggested leads / emails database collections for manual testing reset
  * run_sl: reset, and then re-run
  * enrich_data: given a list of suggested leads, add more data to them (company name)
      input: enrich_items: [email]
  
  Planned actions:
  * run on a schedule to update salesforce email activities
  
  event structure: the actions are run in sequence, for each user or for "all" users
  {
    "actions": ["reset_sl", "run_sl"] ,
    "users": ["greg.maxedon@mistywest.com"]
  }
  '''
  try:
    logger.info(event)

    db = mongo.auth_mongo()

    if event['users'] == 'all':
      users = mongo.get_users(db)
      for user in users:
        user_email = user['_id']
        for action in event['actions']:
          perform_action(action, user_email, event, db)

    else:
      for user_email in event['users']:
        for action in event['actions']:
          perform_action(action, user_email, event, db)
      

  except Exception as error:
    logger.error(error)
