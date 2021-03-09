'use strict';

const cookies = require('browser-cookies');
const config = require('./config');

function deleteCookie() {
  cookies.set(config.cookieName, '');
}

/*function setCookie(token) {
  cookies.set(config.cookieName, token, { expires: 0 });
}*/

function getJwtToken() {
  const jwt = cookies.get(config.cookieName);
  if (!jwt) {
    return null;
  }

  return jwt;
}

module.exports = {
  deleteCookie,
  //setCookie,
  getJwtToken
};
