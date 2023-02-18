import os
from dotenv import load_dotenv

PATHS = ['../supabase/.env', './supabase/.env']

def load():
  # the dotenv_path is relative to the directory the python program is called from
  # (not the directory of this file).  load checks a few different paths to 
  # the .env since its not sure which directory it was called from.
  path = next(p for p in PATHS if os.path.isfile(p)) 
  print('# env path')
  print(path)

  load_dotenv(dotenv_path = path)
  print('# environment variables loaded')