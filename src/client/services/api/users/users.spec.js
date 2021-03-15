'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser: createUserDao, getUsersWithProps } = require('../../../../server/dao/users/users');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomUser } = require('../../../../../test-helpers/generate-data');
const { getUsers, createUser, updateUser } = require('./users');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

describe('client-side user related API calls', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  afterEach(() => {
    logUserOut();
  });

  describe('getUsers', () => {
    it('returns the user list if current user is admin', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUserDao(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const userData1 = generateRandomUser();
      const userData2 = generateRandomUser();
      const userId1 = await createUserDao(userData1);
      const userId2 = await createUserDao(userData2);

      const users = await getUsers();

      expect(users).toEqual(jasmine.arrayWithExactContents([
        { id: userId, ...userData },
        { id: userId1, ...userData1 }, 
        { id: userId2, ...userData2 }
      ]));
    }));
  });

  describe('createUser', () => {
    it('creates a new user with the given data if current user is admin', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
      const userId = await createUserDao(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const newUserData = generateRandomUser({ email: 'b@gmail.com' });
      await createUser(newUserData);

      const [newUser] = await getUsersWithProps({ email: 'b@gmail.com' });

      expect(newUser).toEqual(jasmine.objectContaining(newUserData));
    }));
  });

  describe('updateUser', () => {
    it('updates the given user correctly if current user is admin', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
      const userId = await createUserDao(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const otherUserData = generateRandomUser({ email: 'b@gmail.com' });
      const otherId = await createUserDao(otherUserData);
      const userDataToUpdate = { molyUserName: 'karika' };

      await updateUser(otherId, userDataToUpdate);

      const [updatedUser] = await getUsersWithProps({ email: 'b@gmail.com' });

      expect(updatedUser).toEqual({ id: otherId, ...otherUserData, ...userDataToUpdate });
    }));

    it('updates a non-admin user correctly if he is trying to modify his own details', withServer(async () => {
      const userData = generateRandomUser({ role: 'user', email: 'a@gmail.com' });
      const userId = await createUserDao(userData);
      await logUserIn({ id: userId, role: 'user' });

      const userDataToUpdate = { molyUserName: 'karika' };
      await updateUser(userId, userDataToUpdate);

      const [updatedUser] = await getUsersWithProps({ email: 'a@gmail.com' });

      expect(updatedUser).toEqual({ id: userId, ...userData, ...userDataToUpdate });
    }));
  });
});
