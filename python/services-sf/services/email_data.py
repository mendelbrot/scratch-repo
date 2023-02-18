import logging
import time
from services import mongo, google, salesforce, aws
import config
import json

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

mw_domain = config.env['SETTINGS']['mw_domain']
ignore_contact_beyond_days = config.env['SETTINGS']['ignore_contact_beyond_days']
max_email_length = int(config.env['SETTINGS']['max_email_length'])
STAGE = config.env['STAGE']

# input: a To, From, CC header value like
# 'a@home.com, Gregory Maxedon <gregory.maxedon@gmail.com>'
# "Kredacted, Dr. Sredacted" <Sredacted.Kredacted@home.co>
# return: [{first_name, last_name, title, email}, ...]
def parse_to_from_header(value):
  corres = value.split(', ')
  corres_output = []
  index = 0
  while index < len(corres):
    corre = corres[index] # the current correspondent from the comma seperated header value
    if corre.endswith('>'):
      values = corre.split(' ')
      email = values[-1].strip(' \'"<>')
      email_name = email.split('@')[0]
      first_name = email_name
      last_name = None
      title = None
      if '.' in email_name:
        [first_name, last_name, *rest] = email_name.split('.')
      elif '_' in email_name:
        [first_name, last_name, *rest] = email_name.split('_')
      if first_name: first_name = first_name.capitalize()
      if last_name: last_name = last_name.capitalize()

      if len(values) == 2:
        first_name = values[0].strip(' \'"<>').capitalize()
      elif len(values) == 3:
        first_name = values[0].strip(' \'"<>').capitalize()
        last_name = values[-2].strip(' \'"<>').capitalize()
      elif len(values) >= 4:
        title = values[0].strip(' \'"<>')
        first_name = values[1].strip(' \'"<>').capitalize()
        last_name = values[-2].strip(' \'"<>').capitalize()
        if (len(first_name) == 1 and title != None):  
          # this is probably the case where there's a one letter middle name
          # and the title here is actually the first name
          first_name = title
          title = None

        item = {
          'title': title,
          'first_name': first_name,
          'last_name': last_name,
          'email': email,
        }
        corres_output.append(item)
      else:
        # if the length isn't one of these then don't add anything
        pass
    
    elif '@' in corre: # the value is just an email like 'me@home.com'
      email_name = corre.split('@')[0]
      first_name = email_name
      last_name = None
      if '.' in email_name:
        [first_name, last_name, *rest] = email_name.split('.')
      elif '_' in email_name:
        [first_name, last_name, *rest] = email_name.split('_')
      if first_name: first_name = first_name.capitalize()
      if last_name: last_name = last_name.capitalize()

      item = {
        'title': None,
        'first_name':first_name,
        'last_name': last_name,
        'email': corre
      }
      corres_output.append(item)
    else: 
      # this is a case where there's a comma in the name: process this item with the item after it
      # (likely a lastname, firstname situation)
      if index + 1 == len(corres): # if there's no next element to combine with then just drop it and log the mystery
        logger.warn('parse_to_from_header: no following element to combine with: {0}'.format(corre))
        index += 1
        continue

      # the plan (for now) is to split the next one into an array, 
      # then tuck this in as the second-last element (likely the last name),
      # recombine into a space-seperated string and then process as usual

      rest_of_values = corres[index + 1].split(' ')

      if len(rest_of_values) < 1:
        logger.warn('parse_to_from_header: rest of values empty: {0}'.format(corre))
        index += 1
        continue

      combined_values = ' '.join(rest_of_values[:-1] + [corre] + [rest_of_values[-1]])

      corres[index + 1] = combined_values

    index += 1

  return corres_output

# build a dictionary of email correspondents indexed by email
# the db connection is an input so that it can check excluded addresses
# input: [{message_id, thread_id, date, headers},... ]
# return: {email: {first_name, last_name, last_contact_date, email_message_ids[]}, ...}
def build_corres_dict(messages_data, user_email, db):
  if messages_data:

    # get the list of user specific excluded addresses, to not include them in this corres dictionary
    tic=time.time()
    excluded_addresses = mongo.get_excluded_addresses(user_email, db)
    toc=time.time()
    logger.info(f'mongo.get_excluded_addresses: {toc-tic:0.4f} / {len(excluded_addresses)}')

    # get the list of user specific excluded email domains
    tic=time.time()
    excluded_domains = mongo.get_excluded_domains(db)
    toc=time.time()
    logger.info(f'mongo.get_excluded_domains: {toc-tic:0.4f} / {len(excluded_domains)}')

    corres_dict = {}
    for m_data in messages_data:
      message_id = m_data['message_id']
      date = m_data.get('date')
      headers = m_data.get('headers')
      
      if headers:
        for header in headers:
          if (
            header['name'].lower() == 'from' or 
            header['name'].lower() == 'to' or 
            header['name'].lower() == 'cc'
          ):
            data = parse_to_from_header(header['value'])
            for item in data:
              [email_name, email_domain, *rest] = item['email'].split('@')
              if (
                # item['email'] != user_email and
                # ignore suggested leads from all emails that end with mistywest.com (later add an excluded domains list)
                not (email_domain == mw_domain) and
                (email_domain not in excluded_domains) and
                (item['email'] not in excluded_addresses) and
                (len(item['email']) < max_email_length)
              ):
                corre = corres_dict.get(item['email'], { # defaults:
                  'email_message_ids': [],
                  'first_name': item.get('first_name'),
                  'last_name': item.get('last_name')
                })
                
                # update the date
                try:
                  corre['last_contact_date'] = max(
                    corre.get('last_contact_date'), 
                    date
                  )
                except:
                  if not corre.get('last_contact_date'):
                    corre['last_contact_date'] = date

                # add the message ids
                corre['email_message_ids'].append(message_id)

                # add the correspondent to the dictionary 
                # (or if it already was in the dictionary, add it back with the 
                # updated last contact date and message ids)
                corres_dict[item['email']] = corre

    return corres_dict

# suggested lead: {email, first_name, last_name, email_message_ids, last_contact_date}
# the new ones get added to the database
# the existing ones get updated with the new last_contact_date and adding the new email_message_ids
def update_suggested_leads(user_email, db):
  try:
    tic0=time.time()

    # get the most recent message already in the database, 
    # to then only query messages newer than this one.
    # (note: if another function like email sync also independently adds to the list 
    # then there can be a problem with the reliability of referencing this list for 
    # the most recent message that was already processed)
    tic=time.time()
    most_recent_email_message = mongo.get_most_recent_email_message(user_email, db)
    toc=time.time()
    logger.info(f'mongo.get_most_recent_email_message: {toc-tic:0.4f}')

    # get the messages, they have the data:
    # { message_id, thread_id, date, headers }
    last_timestamp = most_recent_email_message.get('date') if most_recent_email_message else None
    gmail_query = 'in:sent newer_than:{0}d'.format(ignore_contact_beyond_days)
    logger.info(gmail_query)
    if last_timestamp:
      gmail_query += ' after:' + str(last_timestamp + 1) # + 1 makes it after the last message, putting - 600 would give 10 minutes overlap
    tic=time.time()
    messages_data = google.get_messages_data(user_email, gmail_query)
    toc=time.time()
    logger.info(f'google.get_messages_data: {toc-tic:0.4f} / {len(messages_data)}')

    if messages_data:
      # build the dictionary of recent email correspondents
      corres_dict = build_corres_dict(messages_data, user_email, db)
      logger.info(f'email_data.build_corres_dict: / {len(corres_dict)}')

      # find out which emails are in the crm to exclude them from the suggested leads
      tic=time.time()
      crm_email_addresses = salesforce.get_contact_lead_email_addresses_list()
      toc=time.time()
      logger.info(f'salesforce.get_contact_lead_email_addresses_list: {toc-tic:0.4f} / {len(crm_email_addresses)}')

      # flatten the crm email addresses: the results are a list of lists [[email, email, ...], [ ...], ...]
      # also move to lower case for check
      flat_crm_email_addresses = [email.lower() for row in crm_email_addresses for email in row]
      logger.info(f'flat_crm_email_addresses: / {len(flat_crm_email_addresses)}')

      # build the list of suggested leads:
      # corres that haven't yet been excluded and whose emails aren't in the crm.
      # Note that some of these suggested leads may already be in the database,
      # and some suggested leads in the database won't be in this list
      suggested_leads = [
        {
          'email': email,
          'first_name': data.get('first_name'),
          'last_name': data.get('last_name'),
          'email_message_ids': data.get('email_message_ids'),
          'last_contact_date': data.get('last_contact_date'),
        } for email, data in corres_dict.items() if email.lower() not in flat_crm_email_addresses ]
      
      # update the suggested leads in the database
      tic=time.time()
      mongo.update_suggested_leads(suggested_leads, user_email, db)
      toc=time.time()
      logger.info(f'mongo.update_suggested_leads: {toc-tic:0.4f} / {len(suggested_leads)}')

      # add these messages to the database 
      # they will referenced the next time this function runs
      # (the most recent message will be referenced to know to only get data after that message)
      # this was moved to the end of the function because I don't want to add the messages if I errord in adding the suggested leads
      # (when this on was at the beginning, then if there was an error the first time, it would prevent it from trying on subsequent requests)
      tic=time.time()
      # for now: only add the most recent message
      most_recent = max(messages_data, key=lambda m: m['date'])
      mongo.add_email_messages([most_recent], user_email, db)
      toc=time.time()
      logger.info(f'mongo.add_email_messages: {toc-tic:0.4f}')

      # call the processor to update the company names
      function = STAGE + '-processor-sf'
      payload = {
        "actions": ["enrich_data"], 
        "emails": [ sl['email'] for sl in suggested_leads],
        "users": [user_email]
        }
      payload = json.dumps(payload)
      logger.info(f'Calling processor: function: {function}, payload: {payload}')
      response = aws.invoke_lambda(function, payload)
      logger.info(f'Processor response: {response}')

      # finish timing the whole function
      toc0=time.time()
      logger.info(f'email_data.update_suggested_leads: {toc0-tic0:0.4f}')

      return {
        'user_email': user_email,
        'updated_count': len(suggested_leads)
      }

  except Exception as error:
    logger.error(error)
    return {'error': '{0}'.format(error)}

