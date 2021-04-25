'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { createAuthor, getAuthorById } = require('../../../../server/dao/authors/authors');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomAuthor, generateRandomUser } = require('../../../../../test-helpers/generate-data');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

const { getAuthors, getAuthor, updateAuthor, saveAuthor } = require('./authors');

describe('client-side author related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('authors')
    ]);
  });

  afterEach(async () => {
    logUserOut();
  });

  describe('getAuthors', () => {
    it('returns the author list', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const authorData1 = await generateRandomAuthor();
      const authorData2 = await generateRandomAuthor();
      const authorData3 = await generateRandomAuthor();
      const authorId1 = await createAuthor(authorData1);
      const authorId2 = await createAuthor(authorData2);
      const authorId3 = await createAuthor(authorData3);

      const authors = await getAuthors();

      expect(authors).toEqual(jasmine.arrayWithExactContents([
        { id: authorId1, ...authorData1 },
        { id: authorId2, ...authorData2 },
        { id: authorId3, ...authorData3 }
      ]));
    }));
  });

  describe('getAuthor', () => {
    it('returns the author', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const authorData = await generateRandomAuthor();
      const authorId = await createAuthor(authorData);

      const author = await getAuthor(authorId);

      expect(author).toEqual({ id: authorId, ...authorData });
    }));
  });

  describe('updateAuthor', () => {
    it('updates the author', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const authorData = generateRandomAuthor();
      const authorId = await createAuthor(authorData);

      const dataToUpdate = { name: 'Harry Potter' };

      const response = await updateAuthor(authorId, dataToUpdate);
      const authorInDb = await getAuthorById(authorId);
      const expectedData = { id: authorId, ...authorData, ...dataToUpdate };

      expect(response).toEqual(expectedData);
      expect(authorInDb).toEqual(expectedData);
    }));
  });

  describe('saveAuthor', () => {
    it('creates an author with the given data', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const newAuthorData = generateRandomAuthor();

      const newId = await saveAuthor(newAuthorData);

      const authorInDb = await getAuthorById(newId);
      expect(authorInDb).toEqual({ id: newId, ...newAuthorData });
    }));
  });
});
