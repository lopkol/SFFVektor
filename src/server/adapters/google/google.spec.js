'use strict';

const base64 = require('base-64');
const { getSsoAuthUrl } = require('./google');

describe('Google adapter', () => {
  describe('getSsoAuthUrl', () => {
    it('should encode the state parameter in the auth URL', async () => {
      const state = {
        some: 'very',
        exciting: 'state'
      };

      const url = await getSsoAuthUrl(state);
      const encodedStateFromUrl = new URL(url).searchParams.get('state');
      const stateFromUrl = JSON.parse(base64.decode(encodedStateFromUrl));
      expect(stateFromUrl).toEqual(state);
    });
  });
});
