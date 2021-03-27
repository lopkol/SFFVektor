'use strict';

const path = require('path');
const uploadFile = require('../src/server/adapters/upload-file');
const { cloudStorage } = require('../src/server/config');

(async () => {
  try {
    await uploadFile(path.join(__dirname, '../dist/app.js'));
    console.log(`uploaded app.js to bucket ${cloudStorage.bucketName}`);
  } catch (error) {
    console.log(`failed to upload app.js to bucket ${cloudStorage.bucketName}`, error);
    process.exit(1);
  }
})();
