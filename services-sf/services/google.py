import logging 
import config
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

def auth_google():
  secrets = config.env['SECRETS_GOOGLE']
  scopes = config.env['SCOPES_GOOGLE']

  creds = Credentials.from_service_account_info(
    secrets, 
    scopes=scopes
  )

  return creds

def delegated_gmail_service(creds, email):
  service = build('gmail', 'v1', credentials=creds.with_subject(email))
  return service

def get_messages_data(user_email, gmail_query):
  creds = auth_google()
  service = delegated_gmail_service(creds, user_email)

  messages = []


  request = service.users().messages().list(
    userId='me', 
    q=gmail_query,
    maxResults=500 # default 100, maximum 500
  )

  while request is not None:
    prev_response = request.execute()
    messages += prev_response.get('messages', [])
    request = service.users().messages().list_next(request, prev_response)

  messages_data = []
  # inner function callback builds the mesages data
  def add_message_data(request_id, response, exception):
    if exception is not None:
      logger.error(exception)
    else:
      headers = response.get('payload', {}).get('headers')
      # the docs say the internalDate is more reliable than the date header
      date_string = response.get('internalDate')
      # convert timestamp from millis to secs and convert to int
      date = int(date_string[:-3]) if date_string else None
      data = {
        'message_id': response['id'], 
        'thread_id': response.get('threadId'),
        'date': date, 
        'headers': headers
      }
      messages_data.append(data)

  batch_size = 99 # there is a limit of 100 per bulk gmail request batch
  batched_messages = [messages[i:i + batch_size] for i in range(0, len(messages), batch_size)]

  for b in batched_messages:
    batch = service.new_batch_http_request(callback=add_message_data)

    for m in b:
      request = service.users().messages().get(
        userId='me', 
        id=m['id']
      )
      batch.add(request)

    batch.execute()

  return messages_data
  