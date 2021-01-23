'use strict';

const awaitResources = require('await-resource');
const open = require('open');

const devServerUrl = 'http://localhost:9966/index.html';

(async () => {
  await awaitResources({ url: [devServerUrl] });
  open(devServerUrl);
})();
