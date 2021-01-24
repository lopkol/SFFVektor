'use strict';

const { google } = require('googleapis');
const config = require('../config');

const redirectUrl = 'http://localhost:9966/auth';
const authScopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const oauth2Client = new google.auth.OAuth2(
  config.oauth.clientId,
  config.oauth.clientSecret,
  redirectUrl
);

module.exports = (req, res) => {
  if (req.cookies.beer !== '42') {
    const redirectUrl = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: authScopes
    });

    res.redirect(redirectUrl);
    return;
  }

  res.render('index.ejs', {
    resourceBaseUrl: config.resourceBaseUrl
  });
};
