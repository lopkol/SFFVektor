'use strict';

const { createUser, getUsersWithProps, getUserById, updateUser } = require('./user');
const { clearCollection } = require('../../../../test-helpers/firestore');

describe('user DAO', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  describe('createUser', () => {
    it('creates a user with the given properties', async () => {
      const email = Math.random().toString();
      const role = 'superhero';
      await createUser({ email, role });
      const usersInDb = await getUsersWithProps();

      expect(usersInDb).toEqual([jasmine.objectContaining({ email, role })]);
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

  describe('getUsersWithProps', () => {
    it('returns an empty array if there is no user with the given properties', async () => {
      const userData1 = { email: 'broccoli', role: 'wizard' };
      const userData2 = { email: 'cauliflower', role: 'witch' };
      await createUser(userData1);
      await createUser(userData2);

      const email = 'nonexistent email';
      const usersWithProps = await getUsersWithProps({ email });

      expect(usersWithProps).toEqual([]);
    });

    it('returns all users if called with empty arg', async () => {
      const userData1 = { email: 'broccoli', role: 'wizard' };
      const userData2 = { email: 'cauliflower', role: 'witch' };
      await createUser(userData1);
      await createUser(userData2);

      const usersWithProps = await getUsersWithProps();

      expect(usersWithProps).toEqual(jasmine.arrayWithExactContents([jasmine.objectContaining(userData1), jasmine.objectContaining(userData2)]));
    });

    it('returns the users with the given properties', async () => {
      const userData1 = { email: 'broccoli', role: 'wizard', name: 'jancsi' };
      const userData2 = { email: 'cauliflower', role: 'witch', name: 'jancsi' };
      await createUser(userData1);
      await createUser(userData2);

      const email = 'broccoli';
      const name = 'jancsi';
      const usersWithProps = await getUsersWithProps({ email, name });

      expect(usersWithProps).toEqual([jasmine.objectContaining(userData1)]);
    });
  });

  describe('updateUser', () => {
    it('updates the correct user, only updates the given properties, does not change the others', async () => {
      const userData = { email: 'broccoli', role: 'wizard', name: 'jancsi' };
      const otherUserData = { email: 'cauliflower', role: 'witch', name: 'jancsi' };
      const userId = await createUser(userData);
      await createUser(otherUserData);

      await updateUser(userId, { email: 'cucumber', name: 'juliska' });
      const updatedUserData = await getUserById(userId);

      expect(updatedUserData).toEqual({ email: 'cucumber', role: 'wizard', name: 'juliska' });
    });
  });
});
