'use strict';

require('dotenv-haphap').config('environment/.env', 'environment/test.env', 'environment/confidential.env');
require('@babel/register');
const JasmineDom = require('@testing-library/jasmine-dom').default;
const setupJsdomGlobal = require('jsdom-global');
const axios = require('axios');
const { port } = require('../src/server/config');

axios.defaults.baseURL = `http://localhost:${port}`;
// the order of these setups sadly seems to matter, the axios stuff has to be done before initializing jsdom
setupJsdomGlobal();

beforeAll(() => {
  // matchers can only be added in beforeEach/beforeAll hooks
  jasmine.getEnv().addMatchers(JasmineDom);
});
