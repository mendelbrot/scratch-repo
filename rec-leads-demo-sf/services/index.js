const jsforce = require('jsforce');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

const {
  CRED_FORCE
} = process.env;

/*
  gets sent emails from gmai, 
  then logs into salesforce and gets leads and contacts.
  returns the list of suggested leads:
  [{firstName, lastName, email, uuid}, ...]
  the uuid created to track and update the lead during the user session
*/
exports.getSuggestedLeadsAsync = async function (googleClient, googleToken) {
  try {
    // get the list of gmail messages
    googleClient.credentials = JSON.parse(googleToken);
    const gmail = google.gmail({ version: 'v1', auth: googleClient });
    const { data: { messages: gmailMessages } } = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:sent newer_than:1m',
      maxResults: 100
    });

    // build the list gmailRecipients:
    // [{firstName, lastName, email}, ...]
    const gmailRecipients = [];
    await Promise.all(gmailMessages.map(async (message) => {
      // get recipients for each email
      const { data: { payload: { headers } } } = await gmail.users.messages.get({
        userId: 'me',
        id: message.id
      });
      headers.forEach((header) => {
        if (header.name == 'To') {
          // example value to parse:
          // 'a@home.com, Gregory Maxedon <gregory.maxedon@gmail.com>'
          header.value.split(', ').forEach((recipientString) => {
            rString = recipientString.trim();
            if (rString.endsWith('>')) {
              const values = rString.split(' ');
              gmailRecipients.push({
                firstName: (values.length >= 2 && values[0]) || '',
                lastName: (values.length >= 3 && values[1]) || '',
                email: values[values.length - 1].slice(1, -1)
              });
            } else {
              gmailRecipients.push({
                firstName: '',
                lastName: '',
                email: rString
              })
            }
          });
        };
      });
    }));

    // create Salesforce connection
    const forceKeys = JSON.parse(CRED_FORCE);
    const forceConn = new jsforce.Connection();

    // log into salesforce
    await forceConn.login(forceKeys.un, forceKeys.pw);

    // get leads and contacts
    const { records: leads } = await forceConn.query('SELECT Email FROM Lead');
    const { records: contacts } = await forceConn.query('SELECT Email FROM Contact');

    // TODO get a list of excluded emails
    const excludedEmails = ['greg@home.com'];

    recommendedLeads = [];

    gmailRecipients.forEach((recipient) => {
      const { email } = recipient;
      if (
        !recommendedLeads.some(item => item.email == email) &&
        !excludedEmails.includes(email) &&
        !leads.some(item => item.Email == email) &&
        !contacts.some(item => item.Email == email)
      ) {
        // add the recipient as a suggested lead and add the uuid
        recommendedLeads.push({ ...recipient, uuid: uuidv4() });
      };
    });

    return {
      success: true,
      recommendedLeads
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Error getting recommended leads: ${error.message}`,
    };
  };
};

/* 
  adds the lead with the given values to salesforce
  LastName and Company are required
  {FirstName, LastName, Company, Email}
*/
exports.addLeadAsync = async function (lead) {
  try {
    const leadMessageString = `${lead.FirstName} ${lead.LastName}, ${lead.Company}, ${lead.Email}`;

    try {
      // create Salesforce connection
      const forceKeys = JSON.parse(CRED_FORCE);
      const forceConn = new jsforce.Connection();

      // log into salesforce
      await forceConn.login(forceKeys.un, forceKeys.pw);

      // add the lead
      const ret = await forceConn.sobject('Lead').create(lead);

      if (ret.success) {
        return {
          message: `Lead created: ${leadMessageString}`,
          success: true,
        };
      };
      return {
        message: `Error creating lead: ${leadMessageString}`,
        success: false
      };

    } catch (error) {
      return {
        message: `Error creating lead: ${leadMessageString}.  ${error.message}`,
        success: false
      };
    };
  } catch (error) {
    return {
      message: `Error creating lead: ${error.message}`,
      success: false
    };
  }
};