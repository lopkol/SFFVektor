'use strict';

require('dotenv-haphap').config('environment/.env');

module.exports = {
  port: process.env.PORT,
  resourceBaseUrl: process.env.RESOURCE_BASE_URL
};
