'use strict';

const {
  createBookAlternative,
  updateBookAlternative,
  deleteBookAlternative,
  getBookAlternativesByIds,
  getBookAlternativeWithUrl,
  getBookAlternativesWithProps
} = require('./book-alternatives');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomBookAlternative } = require('../../../../test-helpers/generate-data');
const { v4: uuidv4 } = require('uuid');

describe('book alternatives DAO', () => {
  beforeEach(async () => {
    await clearCollection('bookAlternatives');
  });

  describe('createBookAlternative', () => {
    it('creates book alternatives with the given properties, returns the ids', async () => {
      const alternativeData = generateRandomBookAlternative();
      const id = await createBookAlternative(alternativeData);

      const alternativesInDb = await getBookAlternativesWithProps();
      expect(alternativesInDb).toEqual([{ id: id, ...alternativeData }]);
    });
  });

  describe('updateBookAlternative', () => {
    it('returns null if the book alternative does not exist', async () => {
      const id = uuidv4();
      const alternativeData = generateRandomBookAlternative({ id });
      const res = await updateBookAlternative(id, alternativeData);

      expect(res).toEqual(null);
    });

    it('retruns the correctly updated properties', async () => {
      const alternativeData = generateRandomBookAlternative();
      const id = await createBookAlternative(alternativeData);

      const alternativeDataToUpdate = { id, name: 'kocka' };
      const res = await updateBookAlternative(id, alternativeDataToUpdate);

      expect(res).toEqual({ ...alternativeData, ...alternativeDataToUpdate });
    });

    it('correctly updates the given book alternative, does not change the others', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const alternativeData3 = generateRandomBookAlternative();
      const id1 = await createBookAlternative(alternativeData1);
      const id2 = await createBookAlternative(alternativeData2);
      const id3 = await createBookAlternative(alternativeData3);

      const newAlternativeData2 = {
        name: 'new name 2'
      };

      await updateBookAlternative(id2, newAlternativeData2);

      const res = await getBookAlternativesWithProps();

      expect(res).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...alternativeData1 },
          { id: id2, ...alternativeData2, ...newAlternativeData2 },
          { id: id3, ...alternativeData3 }
        ])
      );
    });
  });

  describe('deleteBookAlternative', () => {
    it('returns null if the given id does not exist', async () => {
      const res = await deleteBookAlternative('no-id');
      expect(res).toBe(null);
    });

    it('deletes the alternative with the given id and returns the details', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const alternativeData3 = generateRandomBookAlternative();
      const id1 = await createBookAlternative(alternativeData1);
      const id2 = await createBookAlternative(alternativeData2);
      const id3 = await createBookAlternative(alternativeData3);

      const res = await deleteBookAlternative(id2);
      expect(res).toEqual({ id: id2, ...alternativeData2 });

      const alternativesInDb = await getBookAlternativesWithProps();
      expect(alternativesInDb).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...alternativeData1 },
          { id: id3, ...alternativeData3 }
        ])
      );
    });
  });

  describe('getBookAlternativesByIds', () => {
    it('returns the book alternatives with the given ids, in the correct order', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const alternativeData3 = generateRandomBookAlternative();
      const id1 = await createBookAlternative(alternativeData1);
      await createBookAlternative(alternativeData2);
      const id3 = await createBookAlternative(alternativeData3);

      const bookAlternatives = await getBookAlternativesByIds([id3, id1]);

      expect(bookAlternatives).toEqual([
        { id: id3, ...alternativeData3 },
        { id: id1, ...alternativeData1 }
      ]);
    });

    it('returns null in place of book alternatives that do not exist', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();

      const id1 = await createBookAlternative(alternativeData1);
      await createBookAlternative(alternativeData2);

      const books = await getBookAlternativesByIds(['no-id', id1]);

      expect(books).toEqual([null, { id: id1, ...alternativeData1 }]);
    });
  });

  describe('getBookAlternativeWithUrl', () => {
    it('returns an null if there is no book alternative with the given url', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      await createBookAlternative(alternativeData1);
      await createBookAlternative(alternativeData2);

      const url = 'nonexistent url';
      const alternativeWithUrl = await getBookAlternativeWithUrl(url);

      expect(alternativeWithUrl).toBe(null);
    });

    it('returns the correct book alternative', async () => {
      const url = 'some url';
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative({ urls: [url] });
      await createBookAlternative(alternativeData1);
      const id2 = await createBookAlternative(alternativeData2);

      const alternativeWithUrl = await getBookAlternativeWithUrl(url);

      expect(alternativeWithUrl).toEqual({ id: id2, ...alternativeData2 });
    });
  });

  describe('getReadingPlansWithProps', () => {
    it('returns an empty array if there is no book alternative with the given properties', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      await createBookAlternative(alternativeData1);
      await createBookAlternative(alternativeData2);

      const name = 'nonexistent name';
      const alternativesWithProps = await getBookAlternativesWithProps({ name });

      expect(alternativesWithProps).toEqual([]);
    });

    it('returns all book alternatives if called with empty arg', async () => {
      const alternativeData1 = generateRandomBookAlternative();
      const alternativeData2 = generateRandomBookAlternative();
      const alternativeData3 = generateRandomBookAlternative();
      const id1 = await createBookAlternative(alternativeData1);
      const id2 = await createBookAlternative(alternativeData2);
      const id3 = await createBookAlternative(alternativeData3);

      const res = await getBookAlternativesWithProps();

      expect(res).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...alternativeData1 },
          { id: id2, ...alternativeData2 },
          { id: id3, ...alternativeData3 }
        ])
      );
    });

    it('returns the book alternatives with the given properties', async () => {
      const alternativeData1 = generateRandomBookAlternative({ name: 'magyar' });
      const alternativeData2 = generateRandomBookAlternative({ name: 'eredeti' });
      const alternativeData3 = generateRandomBookAlternative({ name: 'magyar' });
      const id1 = await createBookAlternative(alternativeData1);
      await createBookAlternative(alternativeData2);
      const id3 = await createBookAlternative(alternativeData3);

      const res = await getBookAlternativesWithProps({ name: 'magyar' });

      expect(res).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...alternativeData1 },
          { id: id3, ...alternativeData3 }
        ])
      );
    });
  });
});
