'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomUser } = require('../../../../../test-helpers/generate-data');
const { getUsers } = require('./users');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

describe('client-side user related API calls', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  afterEach(() => {
    logUserOut();
  });

  describe('getUsers', () => {
    it('returns the user list', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const userData1 = generateRandomUser();
      const userData2 = generateRandomUser();
      const userId1 = await createUser(userData1);
      const userId2 = await createUser(userData2);

      const users = await getUsers();

      expect(users).toEqual(jasmine.arrayWithExactContents([
        { id: userId, ...userData },
        { id: userId1, ...userData1 }, 
        { id: userId2, ...userData2 }
      ]));
    }));
  });
});
