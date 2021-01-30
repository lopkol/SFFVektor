'use strict';

const { createUser, getUsers, getUserById } = require('./user');
const { clearCollection } = require('../../../test-helpers/firestore');

describe('user DAO', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  describe('createUser', () => {
    it('creates a user with the given properties', async () => {
      const email = Math.random().toString();
      const role = 'superhero';
      await createUser({ email, role });
      const usersInDb = await getUsers();

      expect(usersInDb).toEqual([{ email, role }]);
    });
  });

  describe('getUserById', () => {
    it('returns the user with the given id', async () => {
      const email = Math.random().toString();
      const role = 'superhero';
      const userId = await createUser({ email, role });

      const result = await getUserById(userId);
      expect(result).toEqual({ email, role });
    });

    it('returns null if there is no user with the given id', async () => {
      const result = await getUserById('does-not-exist');
      
      expect(result).toEqual(null);
    });
  });
});
