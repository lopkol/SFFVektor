'use strict';

const request = require('supertest');
const app = require('../../app');

describe('GET /healthcheck', () => {
  it('should respond with 200', async () => {
    await request(app.listen()).get('/healthcheck').expect(200);
  });
});
