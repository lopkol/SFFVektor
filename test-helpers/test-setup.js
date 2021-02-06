'use strict';

require('dotenv-haphap').config('environment/.env', 'environment/test.env', 'environment/confidential.env');
const axios = require('axios');
const { port } = require('../src/server/config');

axios.defaults.baseURL = `http://localhost:${port}`;
