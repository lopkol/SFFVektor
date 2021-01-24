'use strict';

const request = require('supertest');
const app = require('../../app');
const { cookieName } = require('../../config');
const { encode } = require('../../adapters/jwt/jwt');

describe('GET /', () => {
  it('should redirect to SSO page when called without JWT', async () => {
    await request(app.listen())
      .get('/')
      .expect(302);
  });

  it('should redirect to SSO page when called with invalid JWT', async () => {
    const invalidToken = 'ugly-invalid-token';
    await request(app.listen())
      .get('/')
      .set('Cookie', `${cookieName}=${invalidToken}`)
      .expect(302);
  });

  it('should not redirect and return HTML when called with valid JWT', async () => {
    const validToken = encode({ some: 'data' });
    const response = await request(app.listen())
      .get('/')
      .set('Cookie', `${cookieName}=${validToken}`)
      .expect(200);

    const returnedHtml = response.text;
    expect(returnedHtml.includes('<div id="app"></div>'));
  });
});
