## setting up development environment
```
npm install

virtualenv venv --python=python3.8
source venv/bin/activate

pip install -r requirements.txt

put in the secrets data file
```

## packages
```
pip install pymongo
pip install pymongo[srv]
pip install flask==1.1.4
pip install pyjwt cryptography requests
pip install beautifulsoup4
pip install --upgrade google-auth google-api-python-client

pip freeze > requirements.txt
```

# config

make sure to add these files to the root of your folder:
```
config.json
config.dev.json
```
non-secret common settings are kept in the file `config.py`

## dev run server locally
```
sls wsgi serve -s dev
```

## dev run lambda locally
```
sls invoke local -f cronProcessor -s dev
```

## dev deploy
before deploying: export your credentials in the shell
```
sls deploy -s dev
```

## prod deploy
before deploying: export your credentials in the shell
```
sls deploy -s prod
```

## resetting the database and re-running for manual dev testing
```
sls invoke local -f processor -d '{"actions": ["reset_sl", "run_sl"], "users": ["greg.maxedon@mistywest.com"]}' --stage dev
sls invoke local -f processor -d '{"actions": ["reset_sl"], "users": ["greg.maxedon@mistywest.com", "leigh@mistywest.com"]}'
sls invoke local -f processor -d '{"actions": ["reset_sl", "run_sl"], "users": ["leigh@mistywest.com"]}' --stage prod
sls invoke local -f processor -d '{"actions": ["reset_sl"], "users": "all"}' --stage prod
```