'use strict';

const express = require('express');
const request = require('supertest');
const cookieParser = require('cookie-parser');
//const { subMinutes } = require('date-fns');
const jwt = require('../../adapters/jwt/jwt');
const jwtMiddleware = require('./jwt-middleware');
const { cookieName } = require('../../config');

describe('JWT middleware', () => {
  const testApp = express();
  let requestObject;
  testApp.get('/test-endpoint', cookieParser(), jwtMiddleware, (req, res) => {
    requestObject = req;
    res.sendStatus(200);
  });

  async function callEndpointWithJwtMiddleware({ cookie = '', expectedStatus = 200 }) {
    const response = await request(testApp.listen())
      .get('/test-endpoint')
      .set('Cookie', [cookie])
      .expect(expectedStatus);

    return { request: requestObject, response };
  }

  it('should respond with 401 when called without jwt token', async () => {
    await callEndpointWithJwtMiddleware({ cookie: '', expectedStatus: 401 });
  });

  it('should respond with 401 when called with an invalid jwt token', async () => {
    const { response } = await callEndpointWithJwtMiddleware({
      cookie: `${cookieName}=predator monkey`,
      expectedStatus: 401
    });
    expect(response.body.reason).toEqual('invalid_token');
  });

  /*it('should respond with 401 when called with an expired jwt token', async () => {
    const token = jwt.encode({
      iat: subMinutes(new Date(), 10).getTime(),
      ttl: 1000
    });
    const { response } = await callEndpointWithJwtMiddleware({
      cookie: `${cookieName}=${token}`,
      expectedStatus: 401
    });
    expect(response.body.reason).toEqual('invalid_token');
  });*/

  it('should call through to endpoint if jwt is valid', async () => {
    const token = jwt.encode({
      iat: Date.now(),
      ttl: 60000
    });

    await callEndpointWithJwtMiddleware({ cookie: `${cookieName}=${token}`, expectedStatus: 200 });
  });

  it('should decorate decoded jwt data to request object if jwt is valid', async () => {
    const tokenData = {
      iat: Date.now(),
      ttl: 60000,
      some: 'other data'
    };
    const token = jwt.encode(tokenData);

    const { request } = await callEndpointWithJwtMiddleware({ cookie: `${cookieName}=${token}` });

    expect(request.jwtData).toEqual(tokenData);
  });
});
