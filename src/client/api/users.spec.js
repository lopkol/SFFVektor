'use strict';

const { withServer } = require('../../../test-helpers/server');
const { createUser } = require('../../server/dao/users/users');
const { clearCollection } = require('../../../test-helpers/firestore');
const { generateRandomUser } = require('../../../scripts/generate-data');
const { getUsers } = require('./users');

describe('client-side user related API calls', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  describe('getUsers', () => {
    it('returns the user list', withServer(async () => {
      const userData1 = generateRandomUser();
      const userData2 = generateRandomUser();
      const userId1 = await createUser(userData1);
      const userId2 = await createUser(userData2);
    
      userData1.id = userId1;
      userData2.id = userId2;

      const users = await getUsers();

      expect(users).toEqual(jasmine.arrayWithExactContents([userData1, userData2]));
    }));
  });
});