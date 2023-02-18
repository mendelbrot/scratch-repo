import config
import logging
import time
from services import mongo

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

def clean_suggested_leads(db):
  logger.info('clean_suggested_leads')
  user_emails = [user['_id'] for user in mongo.get_users(db)]
  logger.info(user_emails)
  num_days = config.env['SETTINGS']['ignore_contact_beyond_days']
  remove_before_time = int(time.time() - (86400 * num_days)) # 86400 is the number if seconds in a day
  logger.info(remove_before_time)
  mongo.remove_old_suggested_leads(remove_before_time, user_emails, db)
  return

def main(event, context):
  '''runs on a schedule to perform data maintenance actions

  Current actions:
  * remove suggested leads that are last contacted past a given number of days
  
  Planned actions:
  * update salesforce email activities: add new emails to the activities
  '''
  logger.info('started')
  db = mongo.auth_mongo()
  clean_suggested_leads(db)
  return