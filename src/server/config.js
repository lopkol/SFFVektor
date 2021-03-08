'use strict';

require('./env-loader');

module.exports = {
  port: process.env.PORT,
  resourceBaseUrl: process.env.RESOURCE_BASE_URL,
  appBaseUrl: process.env.APP_BASE_URL,
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
  },
  jwtSecret: process.env.JWT_SECRET,
  cookieName: 'jwtToken',
  allowedUsers: JSON.parse(process.env.ALLOWED_USERS || '[]'),
  firestore: {
    credentials: JSON.parse(process.env.GCP_CREDENTIALS || '{}'),
    projectId: process.env.FIRESTORE_PROJECT_ID
  },
  moly: {
    baseUrl: 'https://moly.hu',
    sffVektorUsername: process.env.MOLY_SFFVEKTOR_USERNAME,
    sffVektorPassword: process.env.MOLY_SFFVEKTOR_PASSWORD
  },
  dataEncryption: {
    secret: process.env.DATA_ENCRYPTION_SECRET,
    emailHashLength: 64,
    emailSalt: process.env.EMAIL_SALT
  }
};
