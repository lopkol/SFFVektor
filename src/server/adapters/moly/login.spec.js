'use strict';

const nock = require('nock');
const { moly } = require('../../config');

const { getAuthenticityToken, getUserCredentials } = require('./login');
const { testLoginPage, testAuthenticityToken } = require('../../../../test-helpers/moly');

describe('Moly login', () => {
  //TODO
  /*describe('getAuthenticityToken', () => {
    it('returns the authenticity_token from the html', async () => {
      const authenticityToken = await getAuthenticityToken();
      expect(authenticityToken).toEqual(testAuthenticityToken);
    });
  });

  describe('getUserCredentials', () => {
    it('returns the user_credentials', async () => {
      const userCredentials = await getUserCredentials();

      expect(userCredentials).toEqual('');
    });
  });*/
});
