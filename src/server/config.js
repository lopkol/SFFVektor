'use strict';

require('dotenv-haphap').config('environment/.env', 'environment/confidential.env');

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
  }
};
