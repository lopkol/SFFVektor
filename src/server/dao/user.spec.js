'use strict';

const { createUser, getUsers } = require('./user');

xdescribe('user DAO', () => {
  describe('createUser', () => {
    it('creates a user with the given email', async () => {
      const email = Math.random().toString();
      await createUser(email);
      const usersInDb = await getUsers();

      expect(usersInDb).toEqual([{ email }]);
    });
  });
});
