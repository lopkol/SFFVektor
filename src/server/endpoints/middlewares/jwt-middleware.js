'use strict';

const jwt = require('../../adapters/jwt/jwt');
const { cookieName } = require('../../config');

module.exports = (req, res, next) => {
  const jwtToken = req.cookies[cookieName];
  if (!jwtToken) {
    return res.sendStatus(401);
  }

  let tokenData;
  try {
    tokenData = jwt.decode(jwtToken);
  } catch (error) {
    return res.status(401).send({ reason: 'invalid_token' });
  }

  /*if (Date.now() - tokenData.iat > tokenData.ttl) {
    return res.status(401).send({ reason: 'invalid_token' });
  }*/

  req.jwtData = tokenData;
  next();
};
