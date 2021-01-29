'use strict';

const { Firestore } = require('@google-cloud/firestore');
const config = require('../config');

module.exports = new Firestore({
  credentials: config.firestore.credentials,
  projectId: config.firestore.projectId
});
