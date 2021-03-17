'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser, getUsersWithProps } = require('../../../../server/dao/users/users');
const { createBookList } = require('../../../../server/dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomUser, generateRandomBookList } = require('../../../../../test-helpers/generate-data');
const { getUsers, getUser, saveUser, updateUser } = require('./users');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

describe('client-side user related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists')
    ]);
  });

  afterEach(() => {
    logUserOut();
  });

  describe('getUsers', () => {
    it('returns the user list if current user is admin', withServer(async () => {
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

  describe('getUser', () => {
    it('returns the user data if current user is admin', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const otherUserData = generateRandomUser({ email: 'b@gmail.com' });
      const otherId = await createUser(otherUserData);

      const bookListData1 = generateRandomBookList({ year: 2020, juryIds: [otherId, userId] });
      const bookListData2 = generateRandomBookList({ year: 2019, juryIds: [otherId] });
      const bookListId1 = await createBookList(bookListData1);
      const bookListId2 = await createBookList(bookListData2);

      const user = await getUser(otherId);

      expect(user).toEqual({ 
        id: otherId, 
        ...otherUserData, 
        bookLists: jasmine.arrayWithExactContents([
          { id: bookListId1, ...bookListData1 },
          { id: bookListId2, ...bookListData2 }
        ]) 
      });
    }));

    it('returns the user data of a non-admin user if he is trying to get his own details', withServer(async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'user' });

      const bookListData1 = generateRandomBookList({ year: 2020, juryIds: [userId] });
      const bookListData2 = generateRandomBookList({ year: 2019, juryIds: [userId] });
      const bookListId1 = await createBookList(bookListData1);
      const bookListId2 = await createBookList(bookListData2);

      const user = await getUser(userId);

      expect(user).toEqual({ 
        id: userId, 
        ...userData, 
        bookLists: jasmine.arrayWithExactContents([
          { id: bookListId1, ...bookListData1 },
          { id: bookListId2, ...bookListData2 }
        ]) 
      });
    }));
  });

  describe('saveUser', () => {
    it('creates a new user with the given data if current user is admin', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const newUserData = generateRandomUser({ email: 'b@gmail.com' });
      await saveUser(newUserData);

      const [newUser] = await getUsersWithProps({ email: 'b@gmail.com' });

      expect(newUser).toEqual(jasmine.objectContaining(newUserData));
    }));
  });

  describe('updateUser', () => {
    it('updates the given user correctly if current user is admin', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const otherUserData = generateRandomUser({ email: 'b@gmail.com' });
      const otherId = await createUser(otherUserData);
      const userDataToUpdate = { molyUserName: 'karika' };

      await updateUser(otherId, userDataToUpdate);

      const [updatedUser] = await getUsersWithProps({ email: 'b@gmail.com' });

      expect(updatedUser).toEqual({ id: otherId, ...otherUserData, ...userDataToUpdate });
    }));

    it('updates a non-admin user correctly if he is trying to modify his own details', withServer(async () => {
      const userData = generateRandomUser({ role: 'user', email: 'a@gmail.com' });
      const userId = await createUser(userData);
      await logUserIn({ id: userId, role: 'user' });

      const userDataToUpdate = { molyUserName: 'karika' };
      await updateUser(userId, userDataToUpdate);

      const [updatedUser] = await getUsersWithProps({ email: 'a@gmail.com' });

      expect(updatedUser).toEqual({ id: userId, ...userData, ...userDataToUpdate });
    }));
  });
});
