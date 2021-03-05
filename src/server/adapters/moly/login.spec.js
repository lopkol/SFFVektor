'use strict';

const nock = require('nock');
const { moly } = require('../../config');

const { getAuthenticityToken, getUserCredentials } = require('./login');
const { 
  testLoginPage, 
  testAuthenticityToken, 
  testRedirectPage, 
  testMolySessionCookie,
  testUserCredentialsCookie,
  testUserCredentials
} = require('../../../../test-helpers/moly');

describe('Moly login', () => {
  describe('getAuthenticityToken', () => {
    it('returns moly session cookie from the header and the authenticity token from the html', async () => {
      nock(moly.baseUrl)
        .get('/belepes')
        .reply(200, testLoginPage, { 'set-cookie': [testMolySessionCookie] });

      const { authenticityToken, sessionCookie } = await getAuthenticityToken();
      expect(authenticityToken).toEqual(testAuthenticityToken);
      expect(sessionCookie).toEqual(testMolySessionCookie);
    });
  });

  describe('getUserCredentials', () => {
    it('returns the user credentials', async () => {
      nock(moly.baseUrl)
        .get('/belepes')
        .reply(200, testLoginPage, { 'set-cookie': [testMolySessionCookie] })
        .post('/azonositas')
        .reply(302, testRedirectPage, { 'set-cookie': [testUserCredentialsCookie, testMolySessionCookie] });

      const userCredentials = await getUserCredentials();

      expect(userCredentials).toEqual(testUserCredentials);
    });
  });
});
