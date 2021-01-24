'use strict';

const { getSsoAuthUrl } = require('../../adapters/google/google');
const { decode } = require('../../adapters/jwt/jwt');
const { resourceBaseUrl, cookieName } = require('../../config');

module.exports = (req, res) => {
  try {
    const jwtToken = req.cookies[cookieName];
    if (!isValidToken(jwtToken)) {
      const ssoRedirectUrl = getSsoAuthUrl();
      res.redirect(ssoRedirectUrl);
      return;
    }

    res.render('index.ejs', { resourceBaseUrl });
  } catch (error) {
    res.sendStatus(500);
  }
};

function isValidToken(jwtToken) {
  if (!jwtToken) return false;
  try {
    decode(jwtToken);
    return true;
  } catch (error) {
    return false;
  }
}
