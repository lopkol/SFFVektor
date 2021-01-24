'use strict';

const { google } = require('googleapis');
const config = require('../../config');

const authScopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
const redirectUrl = `${config.appBaseUrl}/auth`;

const oauth2Client = new google.auth.OAuth2(
  config.oauth.clientId,
  config.oauth.clientSecret,
  redirectUrl
);

function getSsoAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: authScopes
  });
}

async function getUserInfo(authorizationCode) {
  const { tokens } = await oauth2Client.getToken(authorizationCode);
  const userinfo = await google.oauth2('v2').userinfo.get({
    access_token: tokens.access_token,
  });
  return userinfo.data;
}

module.exports = {
  getSsoAuthUrl,
  getUserInfo
};
