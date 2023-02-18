from flask import Flask, request
from services import mongo, email_data

app = Flask(__name__)
app.logger.setLevel('INFO')

@app.route('/suggested-leads', methods = ['GET'])
def suggested_leads():
  try:
    app.logger.info('/suggested-leads GET')

    user = request.args.get('user')
    app.logger.info(user)
    if not user:
      raise Exception('no user specified')

    # if update == true then check for new suggested leads, otherwise just show existing ones
    update = request.args.get('update') == 'true'
    app.logger.info('update: {0}'.format(update))

    # pagination:
    # show leads last contacted before given timestamp
    before = request.args.get('before')
    app.logger.info('before: {0}'.format(before))
    try:
      before = int(before)
      before = before if before != 0 else None
    except:
      before = None
    # limit the number of results (for mongodb, an input of 0 means no limit)
    limit = request.args.get('limit')
    app.logger.info('limit: {0}'.format(limit))
    try:
      limit = int(limit)
    except:
      limit = 0

    # create a connection to the database 
    # (the connection will be passed to functions and used make several calls)
    db = mongo.auth_mongo()

    # this check isn't for security: 
    # rather, it's to prevent accidental typos/wrong email input
    if not mongo.find_user(user, db):
      raise Exception('user not found: {0}'.format(user))

    return_data = {
      'user': user,
      'update': update,
    }

    if update: # update the suggested leads
      return_data['update_response'] = email_data.update_suggested_leads(user, db)

    return_data['data'] = list(mongo.get_suggested_leads(user, db, before, limit))

    return return_data

  except Exception as error:
    app.logger.error(error)
    return {'error': '{0}'.format(error)}

@app.route('/suggested-leads/delete', methods = ['DELETE'])
def delete_suggested_lead():
  try:
    app.logger.info('/suggested-leads DELETE')
    
    user = request.args.get('user')
    app.logger.info(user)
    if not user:
      raise Exception('no user specified')
    
    record = request.args.get('record')
    app.logger.info('record: {0}'.format(record))
    if not record:
      raise Exception('no record specified')

    db = mongo.auth_mongo()

    if not mongo.find_user(user, db):
      raise Exception('user not found: {0}'.format(user))

    return_data = {
      'user': user,
      'record': record,
    }

    return_data['deleted_count'] = mongo.remove_suggested_leads([record], user, db).deleted_count

    return return_data
  
  except Exception as error:
    app.logger.error(error)
    return {'error': '{0}'.format(error)}

@app.route('/excluded-emails', methods = ['GET'])
def get_excluded_emails():
  try:
    app.logger.info('/excluded-emails GET')
    
    user = request.args.get('user')
    app.logger.info(user)
    if not user:
      raise Exception('no user specified')

    db = mongo.auth_mongo()

    if not mongo.find_user(user, db):
      raise Exception('user not found: {0}'.format(user))

    return_data = {
      'user': user,
    }

    return_data['data'] = list(mongo.get_excluded_addresses(user, db))

    return return_data

  except Exception as error:
    app.logger.error(error)
    return {'error': '{0}'.format(error)}

@app.route('/excluded-emails', methods = ['POST'])
def add_excluded_emails():
  try:
    app.logger.info('/excluded-emails POST')
    
    if not request.json:
      raise Exception('no request json')

    app.logger.info(request.json)

    user = request.json.get('user')
    if not user:
      raise Exception('no user specified')

    records = request.json.get('records')
    if not records:
      raise Exception('no records provided')

    db = mongo.auth_mongo()

    if not mongo.find_user(user, db):
      raise Exception('user not found: {0}'.format(user))

    return_data = {
      'user': user,
      'record': records,
    }

    res = mongo.add_excluded_addresses(records, user, db)

    return_data['inserted_ids'] = res['response'].inserted_ids if res['response'] else None
    return_data['error'] = res['error'].details if res['error'] else None

    # after adding the excluded emails, delete the suggested leads with those emails
    mongo.remove_suggested_leads(records, user, db)

    return return_data

  except Exception as error:
    app.logger.error(error)
    return {'error': '{0}'.format(error)}

@app.route('/excluded-emails/delete', methods = ['DELETE'])
def delete_excluded_email():
  try:
    app.logger.info('/excluded-emails DELETE')
    
    user = request.args.get('user')
    app.logger.info(user)
    if not user:
      raise Exception('no user specified')
    
    record = request.args.get('record')
    app.logger.info('record: {0}'.format(record))
    if not record:
      raise Exception('no record specified')

    db = mongo.auth_mongo()

    if not mongo.find_user(user, db):
      raise Exception('user not found: {0}'.format(user))

    return_data = {
      'user': user,
      'record': record,
    }

    return_data['deleted_count'] = mongo.remove_excluded_addresses([record], user, db).deleted_count

    return return_data

  except Exception as error:
    app.logger.error(error)
    return {'error': '{0}'.format(error)}