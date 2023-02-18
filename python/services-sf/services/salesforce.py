import config
import jwt
import time
import requests
import logging 

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

EMAIL_ATTRIBUTES_SF = [
  'Email', 
  'Email_2__c', 
  'Email_3__c', 
  'Email_4__c', 
  'Email_5__c', 
  'Personal_Email__c'
]

def auth_sf():
  secrets_sf = config.env['SECRETS_SF']

  claim = {
    'iss': secrets_sf['issuer'],
    'exp': int(time.time()) + 300,
    'aud': secrets_sf['audience'],
    'sub': secrets_sf['subject'],
  }
  assertion = jwt.encode(
    claim, 
    key=secrets_sf['key'], 
    algorithm='RS256', 
    headers={'alg':'RS256'}
  )

  r = requests.post(
    secrets_sf['auth_uri'],
    data = {
      'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'assertion': assertion
    }
  )

  status = r.status_code
  if status != 200:
    raise Exception('Error authorizing with salesforce: status: {0} response: {1}'.format(status, r.text))

  body = r.json()
  url = body['instance_url']
  token = body['access_token']

  return {'status': status, 'url': url, 'token': token}

def query_sf(query, creds_sf):
  # do while loop to get paginated results
  logger.info(f'salesforce query_sf: {query}')
  url_path =  '/services/data/v51.0/query/?q=' + query
  records = []
  while True:
    r = requests.get(creds_sf['url'] + url_path, headers = {'Authorization': 'Bearer ' + creds_sf['token']})
    
    if r.status_code != 200:
      raise Exception('Error querying salesforce: status: {0} response: {1}'.format(r.status_code, r.text))

    rj = r.json() # attributes of r.json(): ['totalSize'] ['done'] ['nextRecordsUrl']? ['records']

    logger.info(
      '\n query: {0},\n totalSize: {1},\n done: {2},\n nextRecordsUrl: {3},\n len records: {4}'.format(
      query, rj['totalSize'], rj['done'], rj.get('nextRecordsUrl'), len(rj['records']),
    ))

    records += rj['records']
    # for rec in rj['records']:
    #   logger.info(rec)
    
    # stop when no further data to get
    if rj['done']:
      break

    if not rj.get('nextRecordsUrl'):
      logger.warn('query_sf pagination warning: not done but no nextRecordsUrl')
      break
    
    url_path = rj['nextRecordsUrl']

  return records

def get_contact_lead_email_addresses_list():
    q = (
      'SELECT ' + 
      ', '.join(EMAIL_ATTRIBUTES_SF) + ' ' 
      'FROM {object_type}'
    )

    logger.info('salesforce creds_sf')
    creds_sf = auth_sf()

    contacts = query_sf(q.format(object_type='Contact'), creds_sf)
    logger.info(f'CRM Contacts: {len(contacts)}')

    leads = query_sf(q.format(object_type='Lead'), creds_sf)
    logger.info(f'CRM Leads: {len(leads)}')

    email_addresses_list = [
      [c.get(attr) for attr in EMAIL_ATTRIBUTES_SF if c.get(attr)] 
        for c in contacts + leads]
    logger.info(f'CRM total email addresses: {len(email_addresses_list)}')
    
    return email_addresses_list

