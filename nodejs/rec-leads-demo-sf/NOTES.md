# salesforce auth flow
I've had a good experience working with JSforce so far:

https://www.npmjs.com/package/jsforce

```
jsforce
.connect
gregory.maxedon@brave-unicorn-iybjtk.com
<---passwordtoken--->
query("SELECT Id, Name FROM Account LIMIT 1")
query("SELECT Name, Email FROM Lead LIMIT 10")
```
currently the app impersonates a user.  A different authorization would be better, like JWT Bearer Flow: 

https://help.salesforce.com/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5

# google auth flow
The google auth is secure but inconvenient.  I'm thinking about having the server remember the tokens and store them in session storage.  then I think it's the cookie the browser sends to the server that identifies it.  

Google uses cookies on the browser, or something, to remember you are still logged in when you visit a different page.  If this app can do the same thing, then I'm hoping I can put it into salesforce as an iframe.

The flow would be:
1. click "sign in to google"
2. new tab opens and user signs in
3. that tab says "you are signed in.  you can now close this tab"
4. user click "get suggested leads"

https://www.npmjs.com/package/express-session
https://blog.jscrambler.com/best-practices-for-secure-session-management-in-node/

google oauth2 guide

https://developers.google.com/identity/protocols/oauth2

## trying out redis as the session store

```
npm install redis connect-redis
```

I had to install the actual redis:

```
sudo apt install redis-server
```

## error like what I'm getting after adding express-session:

https://github.com/pozil/salesforce-react-integration/issues/2

weirdly, this person is connecting to salesforce also.

several things happened, and session persistence works now!

https://stackoverflow.com/questions/26531143/sessions-wont-save-in-node-js-without-req-session-save

## some info about error handling in async routes

https://itnext.io/using-async-routes-with-express-bcde8ead1de8

## useful jsforce examples

https://jsforce.github.io/blog/posts/20191216-jsforce20-alpha-preview-with-schema-type-feature.html

## deploying to aws

https://medium.com/swlh/deploy-https-node-postgres-redis-react-to-aws-ef252567200d

https://aws.amazon.com/getting-started/hands-on/deploy-nodejs-web-app/

https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html

https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html

```
sudo apt-get install build-essential zlib1g-dev libssl-dev libncurses-dev libffi-dev libsqlite3-dev libreadline-dev libbz2-dev

git clone https://github.com/aws/aws-elastic-beanstalk-cli-setup.git

./aws-elastic-beanstalk-cli-setup/scripts/bundled_installer

*********************************************************************************
3. Cloning the pyenv GitHub project located at https://github.com/pyenv/pyenv.git
*********************************************************************************
Cloning into '/home/greg/.pyenv-repository'...

************************************************************
6. Installing Python 3.7.2. This step may take a few minutes
************************************************************
Downloading Python-3.7.2.tar.xz...
-> https://www.python.org/ftp/python/3.7.2/Python-3.7.2.tar.xz
Installing Python-3.7.2...
Installed Python-3.7.2 to /home/greg/.pyenv/versions/3.7.2

    - Python 3.7.2 is installed at /home/greg/.pyenv/versions/3.7.2/bin

echo 'export PATH="/home/greg/.ebcli-virtual-env/executables:$PATH"' >> ~/.bash_profile && source ~/.bash_profile

echo 'export PATH=/home/greg/.pyenv/versions/3.7.2/bin:$PATH' >> ~/.bash_profile && source /home/greg/.bash_profile



eb init --platform node.js --region us-west-2

```

## deploying to heroku demo

https://github.com/velizarn/redis-demo

https://elements.heroku.com/buttons/velizarn/redis-demo

https://devcenter.heroku.com/articles/heroku-redis

## redis

```
let redisClient = redis.createClient();
console.log(redisClient);

address: '127.0.0.1:6379',
connection_options: { port: 6379, host: '127.0.0.1', family: 4 },
```

## tutorial on crud forms with node express

https://zellwk.com/blog/crud-express-mongodb/

## responses for adding a lead

```
{
  ret: { id: '00Q5e00000168FBEAY', success: true, errors: [] },
  error: null
}

{
  ret: null,
  error: REQUIRED_FIELD_MISSING: Required fields are missing: [LastName, Company]
      at HttpApi.getError (/home/greg/repos/salesforce/recommended-leads-node/node_modules/jsforce/lib/http-api.js:250:13)
      at /home/greg/repos/salesforce/recommended-leads-node/node_modules/jsforce/lib/http-api.js:95:22
      at tryCallOne (/home/greg/repos/salesforce/recommended-leads-node/node_modules/promise/lib/core.js:37:12)
      at /home/greg/repos/salesforce/recommended-leads-node/node_modules/promise/lib/core.js:123:15
      at flush (/home/greg/repos/salesforce/recommended-leads-node/node_modules/asap/raw.js:50:29)
      at processTicksAndRejections (internal/process/task_queues.js:75:11) {
    errorCode: 'REQUIRED_FIELD_MISSING',
    fields: [ 'LastName', 'Company' ]
  }
}
```