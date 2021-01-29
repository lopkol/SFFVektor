'use strict';

const { createUser, getUsers } = require('./user');
const { clearCollection } = require('../../../test-helpers/firestore');

describe('user DAO', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  describe('createUser', () => {
    it('creates a user with the given email', async () => {
      const email = Math.random().toString();
      await createUser(email);
      const usersInDb = await getUsers();

      expect(usersInDb).toEqual([{ email }]);
    });
  });
});
