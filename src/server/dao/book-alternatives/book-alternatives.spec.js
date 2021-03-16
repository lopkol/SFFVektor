'use strict';

const { 
  createBookAlternatives, 
  updateBookAlternatives, 
  getBookAlternativesByIds, 
  getBookAlternativesWithProps 
} = require('./book-alternatives');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomBookAlternative } = require('../../../../test-helpers/generate-data');
const { v4: uuidv4 } = require('uuid');

describe('book alternatives DAO', () => {
  beforeEach(async () => {
    await clearCollection('bookAlternatives');
  });

  describe('createBookAlternatives', () => {
    it('creates book alternatives with the given properties, returns the ids', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const [id1, id2] = await createBookAlternatives([alternativeData1, alternativeData2]);

      const alternativesInDb = await getBookAlternativesWithProps();
      expect(alternativesInDb).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...alternativeData1 },
        { id: id2, ...alternativeData2 }
      ]));
    });
  });

  describe('updateBookAlternatives', () => {
    it('returns null if the book alternative does not exist', async () => {
      const alternativeData = generateRandomBookAlternative({ id: uuidv4() });
      const res = await updateBookAlternatives([alternativeData]);

      expect(res).toEqual([null]);
    });

    it('retruns the correctly updated properties', async () => {
      const alternativeData = generateRandomBookAlternative();
      const [id] = await createBookAlternatives([alternativeData]);

      const alternativeDataToUpdate = { id, name: 'kocka' };
      const res = await updateBookAlternatives([alternativeDataToUpdate]);

      expect(res).toEqual([{ ...alternativeData, ...alternativeDataToUpdate }]);
    });

    it('correctly updates the given book alternatives, does not change the others', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const alternativeData3 = generateRandomBookAlternative();
      const [id1, id2, id3] = await createBookAlternatives([alternativeData1, alternativeData2, alternativeData3]);

      const newAlternativeData1 = { 
        id: id1, 
        name: 'new name 1' 
      };
      const newAlternativeData2 = { 
        id: id2,
        name: 'new name 2' 
      };

      await updateBookAlternatives([newAlternativeData1, newAlternativeData2]);

      const res = await getBookAlternativesWithProps();

      expect(res).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...alternativeData1, ...newAlternativeData1 },
        { id: id2, ...alternativeData2, ...newAlternativeData2 },
        { id: id3, ...alternativeData3 }
      ]));
    });
  });

  describe('getBookAlternativesByIds', () => {
    it('returns the book alternatives with the given ids, in the correct order', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const alternativeData3 = generateRandomBookAlternative();
      const [id1, , id3] = await createBookAlternatives([alternativeData1, alternativeData2, alternativeData3]);

      const bookAlternatives = await getBookAlternativesByIds([id3, id1]);

      expect(bookAlternatives).toEqual([
        { id: id3, ...alternativeData3 }, 
        { id: id1, ...alternativeData1 }
      ]);
    });

    it('returns null in place of book alternatives that do not exist', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();

      const [id1] = await createBookAlternatives([alternativeData1, alternativeData2]);

      const books = await getBookAlternativesByIds(['no-id', id1]);

      expect(books).toEqual([null, { id: id1, ...alternativeData1 }]);
    });
  });

  describe('getReadingPlansWithProps', () => {
    it('returns an empty array if there is no book alternative with the given properties', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      await createBookAlternatives([alternativeData1, alternativeData2]);

      const name = 'nonexistent name';
      const alternativesWithProps = await getBookAlternativesWithProps({ name });

      expect(alternativesWithProps).toEqual([]);
    });

    it('returns all book alternatives if called with empty arg', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const alternativeData3 = generateRandomBookAlternative();
      const [id1, id2, id3] = await createBookAlternatives([alternativeData1, alternativeData2, alternativeData3]);

      const res = await getBookAlternativesWithProps();

      expect(res).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...alternativeData1 },
        { id: id2, ...alternativeData2 },
        { id: id3, ...alternativeData3 }
      ]));
    });

    it('returns the book alternatives with the given properties', async () => {
      const alternativeData1 = generateRandomBookAlternative({ name: 'magyar' });
      const alternativeData2 = generateRandomBookAlternative({ name: 'eredeti' });
      const alternativeData3 = generateRandomBookAlternative({ name: 'magyar' });
      const [id1, , id3] = await createBookAlternatives([alternativeData1, alternativeData2, alternativeData3]);

      const res = await getBookAlternativesWithProps({ name: 'magyar' });

      expect(res).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...alternativeData1 },
        { id: id3, ...alternativeData3 }
      ]));
    });
  });
});
