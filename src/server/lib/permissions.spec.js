'use strict';

const { isActiveUser, isAdmin, canViewBookList } = require('./permissions');
const { clearCollection } = require('../../../test-helpers/firestore');
const { createUser } = require('../dao/users/users');
const { createBookList } = require('../dao/book-lists/book-lists');
const { generateRandomUser, generateRandomBookList } = require('../../../test-helpers/generate-data');

describe('permission checkers', () => {
  beforeEach(async () => {
    await clearCollection('users');
    await clearCollection('bookLists');
  });

  describe('isAciveUser', () => {
    it('returns false if not an active user', async () => {
      const userData = generateRandomUser({ role: 'potentialJury' });
      const userId = await createUser(userData);

      const res = await isActiveUser(userId);

      expect(res).toBe(false);
    });

    it('returns true if user', async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      const res = await isActiveUser(userId);

      expect(res).toBe(true);
    });

    it('returns true if admin', async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      const res = await isActiveUser(userId);

      expect(res).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('returns false if not admin', async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      const res = await isAdmin(userId);

      expect(res).toBe(false);
    });

    it('returns true if admin', async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      const res = await isAdmin(userId);

      expect(res).toBe(true);
    });
  });

  describe('canViewBookList', () => {
    it('returns false if not admin and not on jury of booklist', async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      const bookListData = generateRandomBookList({ jury: ['1', '2', '3'] });
      const bookListId = await createBookList(bookListData);

      const res = await canViewBookList(userId, bookListId);

      expect(res).toBe(false);
    });

    it('returns true if admin', async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      const bookListData = generateRandomBookList({ jury: ['1', '2', '3'] });
      const bookListId = await createBookList(bookListData);

      const res = await canViewBookList(userId, bookListId);

      expect(res).toBe(true);
    });

    it('returns true if on jury of booklist', async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      const bookListData = generateRandomBookList({ jury: ['1', '2', '3', userId] });
      const bookListId = await createBookList(bookListData);

      const res = await canViewBookList(userId, bookListId);

      expect(res).toBe(true);
    });
  });
});
