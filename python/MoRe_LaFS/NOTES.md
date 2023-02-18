## Tutorial

https://www.serverless.com/blog/flask-python-rest-api-serverless-lambda-dynamodb

### virtualenv

```
$ virtualenv venv --python=python3
$ source venv/bin/activate
$ deactivate
```

I had a problem with permissions installing serverless through node:

```
$ npm install -g serverless
```

So I removed node and npm

```
$ sudo apt-get purge node
$ sudo apt-get autoremove
```

And I installed nvm

https://github.com/nvm-sh/nvm

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
$ nvm install --lts
$ nvm ls 14
$ nvm alias default 14.15.1
```

Hee's how to list all global packages in a version

```
$ npm list -g --depth 0
```

files added when setting up serverless for autocomplete.  I said no to 
"We will install completion to ~/.bashrc, is it ok ?"  but was not able to entirely cancel tab completion setup.

=> Added tabtab source line in "~/.config/tabtab/__tabtab.bash" file
=> Added tabtab source line in "~/.config/tabtab/__tabtab.bash" file

Also, I was asked "Serverless: Would you like the Framework to update automatically? No"   I couldn't find out what this means, but I found this:
https://github.com/serverless/serverless/blob/master/CHANGELOG.md
(sls config --autoupdate) was changed on october 29, 2020, just two weeks ago.

### mongodb compass
```
adminUser password 7G52uu66FDgwHG82
mongodb+srv://adminUser:7G52uu66FDgwHG82@cluster0.bv8uf.mongodb.net/test

5fNWtn8NfQktr5EC
mongodb+srv://new-admin:5fNWtn8NfQktr5EC@cluster0.bv8uf.mongodb.net/test

mongo "mongodb+srv://cluster0.bv8uf.mongodb.net/cluster0" --username adminUser

$ python -m pip install pymongo[snappy,aws,gssapi,srv,tls]
there were errors.  ended up doing
$ python -m pip install pymongo


list python packages
$ pip list

$ pip freeze > requirements.txt

$ sls wsgi serve

client = pymongo.MongoClient("mongodb+srv://<username>:<password>@cluster0.bv8uf.mongodb.net/<dbname>?retryWrites=true&w=majority")
db = client.test

mongodb+srv://adminUser:7G52uu66FDgwHG82@cluster0.bv8uf.mongodb.net/cluster0?retryWrites=true&w=majority

```

### serverless deployement

api gateway endpoint (under the function's configuration tab)

https://oswb1t7rbl.execute-api.us-west-2.amazonaws.com/dev/

### Logging

https://docs.python.org/3/howto/logging.html#logging-advanced-tutorial

the module levle logger name

```
logger = logging.getLogger(__name__)
```

"This means that logger names track the package/module hierarchy, and it’s intuitively obvious where events are logged just from the logger name."

also:

"[`Logger.setLevel()`](https://docs.python.org/3/library/logging.html#logging.Logger.setLevel) specifies the lowest-severity log message a logger will handle"

### Running Locally

```
serverless wsgi serve
```

