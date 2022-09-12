import logging
import asyncio
import requests
import time
from bs4 import BeautifulSoup
from services import mongo

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

# end before these characters for getting the company name from the webpage title
TITLE_STOP_CHARACTERS = ['|', '-', '~', ':']

def add_company_names(user_email, emails, db):
  try:
    '''
    first filter the emails to remove the ones that are email service domains (gotten by mongo)
    sync run the the gather function, 
    then pass the list to a mongo function that adds the company names to the 
    corresponding suggested leads
    '''

    # start timing 
    tic=time.time()

    # remove the emails that belong to a provider domain
    # ex: 
    # if email_providers = ['outlook'] then
    # email = me@mistywest.com -> True
    # email = me@outlook.com -> False
    email_providers = [item['_id'] for item in mongo.get_email_providers(db)]
    emails = [e for e in emails if e.split('@')[1].split('.')[0].lower() not in email_providers]

    # go find the company names from the emails
    company_names_data = asyncio.run(async_gather_company_names(emails))

    # add the company names to the suggested leads
    logger.info(f'adding company names: {company_names_data}')
    mongo.enrich_suggested_leads(company_names_data, user_email, db)

    # finish timing
    toc=time.time()
    logger.info(
      f'added_company_names: {len(company_names_data)} / {toc-tic:0.4f}'
    )
    
  except Exception as error:
      logger.error(error)

async def async_gather_company_names(emails):
  '''gather the company name returns together in a list
  '''

  try:
    coros = [async_find_company_name(e) for e in emails]
    data = await asyncio.gather(*coros)
    # remove None results
    data = [item for item in data if item is not None]
    return data

  except Exception as error:
      logger.error(error)

# need to make a wrapper function because a timeout is essential
# need to set a timeout or else one page can stall the whole function
# unfortunately requests.Session() has no way of setting a timeout
def req_get(url):
  return requests.get(url, timeout=0.4)

async def async_find_company_name(email):
  '''async function that gets a single company name
  '''

  try:
    domain = email.split('@')[1]

    loop = asyncio.get_event_loop() # https://stackoverflow.com/questions/22190403/how-could-i-use-requests-in-asyncio
    url = 'http://www.' + domain
    page = await loop.run_in_executor(None, req_get, url) 

    status = page.status_code

    if status != 200:
      raise Exception(f'webpage error response. Domain: {domain}, Response Status: {status}')

    soup = BeautifulSoup(page.content, "html.parser")
    title = soup.find('title').text.strip()

    # company is everything to the left of the stop characters
    # ex: "Microsoft - Official Home Page" -> Microsoft
    company = title
    for char in TITLE_STOP_CHARACTERS:
      company = company.split(char)[0]
    company = company.strip()

    data = {'email': email, 'domain': domain, 'company': company}
    return data

  except Exception as error:
    logger.warn(error)
    
    data = {'email': email, 'find_company_name_error': str(error)}
    return data
