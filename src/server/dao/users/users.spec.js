'use strict';

const { createUser, getUsersWithProps, getUserById, updateUser } = require('./users');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomUser } = require('../../../../test-helpers/generate-data');

describe('user DAO', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  describe('createUser', () => {
    it('creates a user with the given properties, returns the user id', async () => {
      const userData = generateRandomUser();
      const id = await createUser(userData);
      const usersInDb = await getUsersWithProps();

      expect(usersInDb).toEqual([{ id, ...userData }]);
    });
  });

  describe('getUserById', () => {
    it('returns the user with the given id', async () => {
      const userData = generateRandomUser();
      const id = await createUser(userData);

      const result = await getUserById(id);
      expect(result).toEqual({ id, ...userData });
    });

    it('returns null if there is no user with the given id', async () => {
      const result = await getUserById('does-not-exist');
      
      expect(result).toEqual(null);
    });
  });

  describe('getUsersWithProps', () => {
    it('returns an empty array if there is no user with the given properties', async () => {
      const userData1 = generateRandomUser({ email: 'broccoli' });
      const userData2 = generateRandomUser({ email: 'cauliflower' });
      await createUser(userData1);
      await createUser(userData2);

      const email = 'nonexistent email';
      const usersWithProps = await getUsersWithProps({ email });

      expect(usersWithProps).toEqual([]);
    });

    it('returns all users if called with empty arg', async () => {
      const userData1 = generateRandomUser();
      const userData2 = generateRandomUser();
      const id1 = await createUser(userData1);
      const id2 = await createUser(userData2);

      const usersWithProps = await getUsersWithProps();

      expect(usersWithProps).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...userData1 }, 
        { id: id2, ...userData2 }
      ]));
    });

    it('returns the users with the given properties', async () => {
      const userData1 = generateRandomUser({ email: 'broccoli', role: 'wizard', name: 'jancsi' });
      const userData2 = generateRandomUser({ email: 'cauliflower', role: 'witch', name: 'jancsi' });
      const id = await createUser(userData1);
      await createUser(userData2);

      const email = 'broccoli';
      const name = 'jancsi';
      const usersWithProps = await getUsersWithProps({ email, name });

      expect(usersWithProps).toEqual([{ id, ...userData1 }]);
    });
  });

  describe('updateUser', () => {
    it('returns null if the id does not exist', async () => {
      const res = await updateUser('someId', { name: 'jancsi' });

      expect(res).toBe(null);
    });

    it('returns the user data with the correctly updated properties', async () => {
      const userData = generateRandomUser();
      const id = await createUser(userData);

      const email = 'broccoli';
      const name = 'jancsi';
      const res = await updateUser(id, { email, name });

      expect(res).toEqual({ ...userData, id, email, name });
    });

    it('updates the correct user, only updates the given properties, does not change the others', async () => {
      const userData = generateRandomUser();
      const otherUserData = generateRandomUser();
      const id = await createUser(userData);
      await createUser(otherUserData);

      const email = 'cucumber';
      const name = 'juliska';
      await updateUser(id, { email, name });
      const updatedUserData = await getUserById(id);

      expect(updatedUserData).toEqual({ ...userData, id, email, name });
    });
  });
});
