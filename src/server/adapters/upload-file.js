'use strict';

const { Storage } = require('@google-cloud/storage');
const { cloudStorage } = require('../config');

const storage = new Storage({
  projectId: cloudStorage.credentials.project_id,
  credentials: cloudStorage.credentials
});

module.exports = async filePath => {
  const bucket = storage.bucket(cloudStorage.bucketName);
  await bucket.upload(filePath);
};
