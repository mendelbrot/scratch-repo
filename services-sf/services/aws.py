import logging
import config

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel('INFO')

try:
  import boto3 # boto3 is too large to upload as a dependency and is automatically included with aws lambda

  def invoke_lambda(function, payload):
    try:
      lambda_client = boto3.client('lambda', region_name=config.env['REGION'])
      response = lambda_client.invoke(
        FunctionName=function,
        InvocationType='Event',
        Payload=payload
      )
      return response
    except Exception as error:
      return error

except ImportError:
  logger.info('local: boto3 import error')

  def invoke_lambda(function, payload):
    return 'local: service not called'