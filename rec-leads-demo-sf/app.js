const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const { MongoClient } = require('mongodb');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const { google } = require('googleapis');
require('dotenv').config();
const routes = require('./routes');

const {
  MONGODB_URL,
  REDIRECT_URL,
  SESSION_SECRETS,
  CRED_GOOGLE,
  GOOGLE_SCOPES,
  PORT
} = process.env;

// set up session
const secrets = JSON.parse(SESSION_SECRETS);
app.use(session({
  secret: secrets,
  store: MongoStore.create({ mongoUrl: MONGODB_URL }),
  resave: false
}));

// puts post request body into req.body
app.use(express.urlencoded());

// set the route handlers
app.get('/', routes.home);
app.get('/refresh', routes.refreshAsync)
app.post('/add', routes.addAsync);
app.get('/auth', routes.auth);
app.get('/signout', routes.signout);

// experimental for google multiple request efficiency
// https://github.com/googleapis/google-api-nodejs-googleClient#http2
google.options({
  http2: true,
});

// create Google oAuth2 googleClient to authorize the API call
const googleKeys = JSON.parse(CRED_GOOGLE);
const googleClient = new google.auth.OAuth2(
  googleKeys.web.client_id,
  googleKeys.web.client_secret,
  REDIRECT_URL
);

// Generate the url that will be used for google authorization
const googleAuthUrl = googleClient.generateAuthUrl({
  access_type: 'offline',
  scope: JSON.parse(GOOGLE_SCOPES)
});

// set global variables with google client data
global.googleClient = googleClient;
global.googleAuthUrl = googleAuthUrl;

// start the server
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
});
