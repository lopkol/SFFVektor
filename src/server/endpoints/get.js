'use strict';

const { getSsoAuthUrl } = require('../adapters/google/google');
const config = require('../config');

module.exports = (req, res) => {
  if (req.cookies.beer !== '42') {
    const ssoRedirectUrl = getSsoAuthUrl();
    res.redirect(ssoRedirectUrl);
    return;
  }

  res.render('index.ejs', {
    resourceBaseUrl: config.resourceBaseUrl
  });
};
