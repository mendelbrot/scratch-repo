import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path='.env.local')

print('# environment variables')
print(os.environ.get('SUPABASE_URL'))

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# class Supabase:
#   def __init__(self):
#     url: str = os.environ.get("SUPABASE_URL")
#     key: str = os.environ.get("SUPABASE_KEY")
#     self.supabase: Client = create_client(url, key)

def create_user(email: str = 'dawn@supamail.com', password: str = '11111111'):
  user = supabase.auth.sign_up(email=email, password=password)
  return user

    



