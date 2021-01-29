'use strict';

require('dotenv-haphap').config('environment/.env', 'environment/confidential.env');

const awaitResources = require('await-resource');
const open = require('open');
const { port } = require('../src/server/config');

const devServerUrl = `http://localhost:${port}`;

(async () => {
  await awaitResources({ url: [devServerUrl] });
  open(devServerUrl);
})();
