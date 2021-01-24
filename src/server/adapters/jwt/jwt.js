'use strict';

const jwt = require('jwt-simple');
const { jwtSecret } = require('../../config');

module.exports = {
  encode: payload => {
    return jwt.encode(payload, jwtSecret);
  },
  decode: token => {
    return jwt.decode(token, jwtSecret);
  }
};
