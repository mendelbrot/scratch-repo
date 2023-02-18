import os
import json

SETTINGS = {
  'ignore_contact_beyond_days': 100,
  'mw_domain': 'mistywest.com',
  'max_email_length': 40
}

# set the global variable config.env
with open(os.environ['ENV_FILE']) as env_file:
  env = json.load(env_file)
  env['SETTINGS'] = SETTINGS