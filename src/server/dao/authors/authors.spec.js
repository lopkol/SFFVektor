'use strict';

const { updateAuthor, getAuthorById, getAuthorsWithProps } = require('./authors');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomAuthor } = require('../../../../test-helpers/generate-data');

describe('authors DAO', () => {
  beforeEach(async () => {
    await clearCollection('authors');
  });

  describe('updateAuthor', () => {
    it('creates an author with the given properties if the id does not exist', async () => {
      const authorData = generateRandomAuthor();
      await updateAuthor(authorData);
      const authorsInDb = await getAuthorsWithProps();

      expect(authorsInDb).toEqual([authorData]);
    });

    it('returns the author data with the correctly updated properties', async () => {
      const authorData = generateRandomAuthor();
      await updateAuthor(authorData);

      const name = 'Nagy Jancsi';
      const res = await updateAuthor({ id: authorData.id, name });

      expect(res).toEqual({ ...authorData, name });
    });

    it('updates the correct author, only updates the given properties, does not change the others', async () => {
      const authorData = generateRandomAuthor({ id: '1' });
      const otherauthorData = generateRandomAuthor({ id: '2' });
      await updateAuthor(authorData);
      await updateAuthor(otherauthorData);

      const name = 'Nagy Juliska';
      await updateAuthor({ id: authorData.id, name });
      const authorsInDb = await getAuthorsWithProps();

      expect(authorsInDb).toEqual(jasmine.arrayWithExactContents([{ ...authorData, name }, otherauthorData]));
    });
  });

  describe('getAuthorById', () => {
    it('returns the author with the given id', async () => {
      const authorData = generateRandomAuthor();
      const id = authorData.id;
      await updateAuthor(authorData);

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
      const authorData1 = generateRandomAuthor({ id: '1', name: 'broccoli' });
      const authorData2 = generateRandomAuthor({ id: '2', name: 'cauliflower' });
      await updateAuthor(authorData1);
      await updateAuthor(authorData2);

      const name = 'nonexistent name';
      const authorsWithProps = await getAuthorsWithProps({ name });

      expect(authorsWithProps).toEqual([]);
    });

    it('returns all authors if called with empty arg', async () => {
      const authorData1 = generateRandomAuthor({ id: '1' });
      const authorData2 = generateRandomAuthor({ id: '2' });
      await updateAuthor(authorData1);
      await updateAuthor(authorData2);

      const authorsWithProps = await getAuthorsWithProps();

      expect(authorsWithProps).toEqual(jasmine.arrayWithExactContents([authorData1, authorData2]));
    });

    it('returns the authors with the given properties', async () => {
      const authorData1 = generateRandomAuthor({ id: '1', name: 'Nagy Jancsi' });
      const authorData2 = generateRandomAuthor({ id: '2', name: 'Kis Jancsi' });
      await updateAuthor(authorData1);
      await updateAuthor(authorData2);

      const name = 'Nagy Jancsi';
      const authorsWithProps = await getAuthorsWithProps({ name });

      expect(authorsWithProps).toEqual([authorData1]);
    });
  });
});
