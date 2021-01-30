'use strict';

const environment = process.env.NODE_ENV || 'dev';
require('dotenv-haphap').config(`environment/${environment}.env`, 'environment/confidential.env');

const dockerToolboxDefaultIp = '192.168.99.100';
const firestoreUrl = process.env.FIRESTORE_EMULATOR_HOST;
const useDockerToolbox = process.env.USE_DOCKER_TOOLBOX === 'true';
const shouldOverrideDbUrl = useDockerToolbox && firestoreUrl && firestoreUrl.includes('localhost');

if (shouldOverrideDbUrl) {
  process.env.FIRESTORE_EMULATOR_HOST = firestoreUrl.replace('localhost', dockerToolboxDefaultIp);
}
