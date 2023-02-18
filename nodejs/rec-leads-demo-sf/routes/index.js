const { getSuggestedLeadsAsync, addLeadAsync } = require('../services');

const { BASE_URL } = process.env;
const signoutUrl = BASE_URL + '/signout';
const refreshUrl = BASE_URL + '/refresh';

// home
exports.home = async function(req, res) {
  const sess = req.session;
  const { message, recommendedLeads } = sess;

  const state = {
    googleAuthUrl: global.googleAuthUrl,
    signoutUrl,
    refreshUrl,
    message,
    recommendedLeads
  };

  res.render('home', { state });
};

// refresh list of suggested leads then redirect to home
exports.refreshAsync = async function (req, res) {
  const sess = req.session;
  const { googleToken } = sess;

  if (googleToken) {

    const { message, recommendedLeads } = await getSuggestedLeadsAsync(global.googleClient, googleToken);
    sess.message = message;
    sess.recommendedLeads = recommendedLeads;
    sess.save();
  };

  res.redirect('/');
};

// add lead then redirect to home
exports.addAsync = async function (req, res) {
  const sess = req.session;

  if (req.body) {
    const { FirstName, LastName, Company, Email, uuid } = req.body;

    const lead = { FirstName, LastName, Company, Email };
    const { success, message } = await addLeadAsync(lead);
    sess.message = message;
    if (success) {
      sess.recommendedLeads = sess.recommendedLeads.filter(item => item.uuid != uuid);
    };
    sess.save();

    res.redirect('/');
  };
}

// accept the Google oauth token.
exports.auth = function(req, res) {
  const sess = req.session;
  const code = req.query && req.query.code;
  if (code) {
    global.googleClient.getToken(code, (err, token) => {
      if (err) {
        console.error('Error getting oAuth tokens:');
        throw err;
      }
      sess.googleToken = JSON.stringify(token);
      sess.save();
    });
  };

  res.send("<script>window.close();</script > ");
}

// signs out of the app
exports.signout = function (req, res) { 
  req.session.destroy(() => {
    res.redirect('/');
  })
}