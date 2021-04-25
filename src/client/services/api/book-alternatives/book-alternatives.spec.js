'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { createBookAlternative, getBookAlternativesByIds } = require('../../../../server/dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomBookAlternative, generateRandomUser } = require('../../../../../test-helpers/generate-data');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

const { getBookAlternative, updateBookAlternative, saveBookAlternative } = require('./book-alternatives');

describe('client-side book alternative related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookAlternatives')
    ]);
  });

  afterEach(async () => {
    logUserOut();
  });

  describe('getBookAlternative', () => {
    it('returns the book alternative', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const bookAlternativeData = await generateRandomBookAlternative();
      const bookAlternativeId = await createBookAlternative(bookAlternativeData);

      const bookAlternative = await getBookAlternative(bookAlternativeId);

      expect(bookAlternative).toEqual({ id: bookAlternativeId, ...bookAlternativeData });
    }));
  });

  describe('updateBookAlternative', () => {
    it('updates the bookAlternative', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const bookAlternativeData = generateRandomBookAlternative();
      const bookAlternativeId = await createBookAlternative(bookAlternativeData);

      const dataToUpdate = { name: 'unicorn' };

      const response = await updateBookAlternative(bookAlternativeId, dataToUpdate);
      const [bookAlternativeInDb] = await getBookAlternativesByIds([bookAlternativeId]);
      const expectedData = { id: bookAlternativeId, ...bookAlternativeData, ...dataToUpdate };

      expect(response).toEqual(expectedData);
      expect(bookAlternativeInDb).toEqual(expectedData);
    }));
  });

  describe('saveBookAlternative', () => {
    it('creates a book alternative with the given data', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const newBookAlternativeData = generateRandomBookAlternative();

      const newId = await saveBookAlternative(newBookAlternativeData);

      const [bookAlternativeInDb] = await getBookAlternativesByIds([newId]);
      expect(bookAlternativeInDb).toEqual({ id: newId, ...newBookAlternativeData });
    }));
  });
});
