'use strict';

require('dotenv-haphap').config('environment/.env', 'environment/confidential.env');

module.exports = {
  port: process.env.PORT,
  resourceBaseUrl: process.env.RESOURCE_BASE_URL,
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET
  }
};
