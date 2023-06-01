'use strict';

const jwt = require('../src/server/adapters/jwt/jwt');
const { setApiCookie } = require('../src/client/services/api/api');
const config = require('../src/server/config');

const createAuthorizationToken = jwtData => jwt.encode(jwtData);
const createAuthorizationCookie = jwtData =>
  `${config.cookieName}=${createAuthorizationToken(jwtData)}`;

const logUserIn = ({ id, role }) => {
  setApiCookie(createAuthorizationToken({ id, role }));
};

const logUserOut = () => {
  setApiCookie('');
};

module.exports = {
  createAuthorizationToken,
  createAuthorizationCookie,
  logUserIn,
  logUserOut
};
