import config
import logging
import base64

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

def main(event, context):
  whole_auth_token = event.get('authorizationToken')
  if not whole_auth_token:
    raise Exception('Unauthorized')

  logger.info(f'Client token: {whole_auth_token}')
  logger.info('Method ARN: {0}'.format(event['methodArn']))

  token_parts = whole_auth_token.split(' ')
  auth_token = token_parts[1]
  token_method = token_parts[0]

  if not (token_method.lower() == 'basic' and auth_token):
    logger.error('Failing due to invalid token_method or missing auth_token')
    raise Exception('Unauthorized')

  lwc_access = config.env['LWC_ACCESS']

  if base64.b64decode(auth_token).decode('ascii') != lwc_access:
    logger.error('invalid access info')
    raise Exception('Unauthorized')

  policy = {
      'principalId': lwc_access.split(':')[0],
      'policyDocument': {
          'Version': '2012-10-17',
          'Statement': [
              {
                  'Action': 'execute-api:Invoke',
                  'Effect': 'Allow',
                  'Resource':'*'
              }
          ]
      }
  }
  
  return policy
  