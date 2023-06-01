'use strict';

const { createAuthor, updateAuthor, getAuthorById, getAuthorsWithProps } = require('./authors');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomAuthor } = require('../../../../test-helpers/generate-data');

describe('authors DAO', () => {
  beforeEach(async () => {
    await clearCollection('authors');
  });

  describe('createAuthor', () => {
    it('creates an author with the given properties, returns the id', async () => {
      const authorData = generateRandomAuthor();
      const id = await createAuthor(authorData);
      const authorsInDb = await getAuthorsWithProps();

      expect(authorsInDb).toEqual([{ id, ...authorData }]);
    });
  });

  describe('updateAuthor', () => {
    it('returns null if the id does not exist', async () => {
      const authorData = generateRandomAuthor();
      const id = '1';
      const res = await updateAuthor(id, authorData);

      expect(res).toEqual(null);
    });

    it('returns the author data with the correctly updated properties', async () => {
      const authorData = generateRandomAuthor();
      const id = await createAuthor(authorData);

      const name = 'Nagy Jancsi';
      const res = await updateAuthor(id, { name });

      expect(res).toEqual({ id, ...authorData, name });
    });

    it('updates the correct author, only updates the given properties, does not change the others', async () => {
      const authorData = generateRandomAuthor();
      const otherAuthorData = generateRandomAuthor();
      const id = await createAuthor(authorData);
      const otherId = await createAuthor(otherAuthorData);

      const name = 'Nagy Juliska';
      await updateAuthor(id, { name });
      const authorsInDb = await getAuthorsWithProps();

      expect(authorsInDb).toEqual(
        jasmine.arrayWithExactContents([
          { id, ...authorData, name },
          { id: otherId, ...otherAuthorData }
        ])
      );
    });
  });

  describe('getAuthorById', () => {
    it('returns the author with the given id', async () => {
      const authorData = generateRandomAuthor();
      const id = await createAuthor(authorData);

      const result = await getAuthorById(id);
      expect(result).toEqual({ id, ...authorData });
    });

    it('returns null if there is no author with the given id', async () => {
      const result = await getAuthorById('does-not-exist');

      expect(result).toEqual(null);
    });
  });

  describe('getauthorsWithProps', () => {
    it('returns an empty array if there is no author with the given properties', async () => {
      const authorData1 = generateRandomAuthor({ name: 'broccoli' });
      const authorData2 = generateRandomAuthor({ name: 'cauliflower' });
      await createAuthor(authorData1);
      await createAuthor(authorData2);

      const name = 'nonexistent name';
      const authorsWithProps = await getAuthorsWithProps({ name });

      expect(authorsWithProps).toEqual([]);
    });

    it('returns all authors if called with empty arg', async () => {
      const authorData1 = generateRandomAuthor();
      const authorData2 = generateRandomAuthor();
      const id1 = await createAuthor(authorData1);
      const id2 = await createAuthor(authorData2);

      const authorsWithProps = await getAuthorsWithProps();

      expect(authorsWithProps).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...authorData1 },
          { id: id2, ...authorData2 }
        ])
      );
    });

    it('returns the authors with the given properties', async () => {
      const authorData1 = generateRandomAuthor({ name: 'Nagy Jancsi' });
      const authorData2 = generateRandomAuthor({ name: 'Kis Jancsi' });
      const id1 = await createAuthor(authorData1);
      await createAuthor(authorData2);

      const name = 'Nagy Jancsi';
      const authorsWithProps = await getAuthorsWithProps({ name });

      expect(authorsWithProps).toEqual([{ id: id1, ...authorData1 }]);
    });
  });
});
