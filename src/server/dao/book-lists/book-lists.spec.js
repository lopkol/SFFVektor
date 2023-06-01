'use strict';

const {
  createBookList,
  updateBookList,
  getBookListById,
  getBookListsWithProps,
  getBookListsOfBook,
  getBookListsOfJuryMember,
  updateBookListsOfJuryMember
} = require('./book-lists');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomBookList } = require('../../../../test-helpers/generate-data');

describe('booklists DAO', () => {
  beforeEach(async () => {
    await clearCollection('bookLists');
  });

  describe('createBookList', () => {
    it('creates a book list with the given properties', async () => {
      const bookListData = generateRandomBookList();
      const id = await createBookList(bookListData);

      const bookListsInDb = await getBookListsWithProps();
      expect(bookListsInDb).toEqual([{ id, ...bookListData }]);
    });

    it('returns null if a book list with the same year and genre already exists', async () => {
      const bookListData = generateRandomBookList({ year: 1955, genre: 'scifi' });
      const otherBookListData = generateRandomBookList({ year: 1955, genre: 'scifi' });

      await createBookList(bookListData);
      const res = await createBookList(otherBookListData);

      expect(res).toBe(null);
    });
  });

  describe('updateBookList', () => {
    it('returns null if id does not exist', async () => {
      const res = await updateBookList('2013scifi', { url: 'some url' });

      expect(res).toBe(null);
    });

    it('returns the book list data with the correctly updated properties', async () => {
      const bookListData = generateRandomBookList();
      const id = await createBookList(bookListData);

      const res = await updateBookList(id, { url: 'some url' });

      expect(res).toEqual({
        ...bookListData,
        id,
        url: 'some url'
      });
    });

    it('updates the correct book list and only the given properties', async () => {
      const bookData1 = generateRandomBookList({ year: 1778 });
      const bookData2 = generateRandomBookList({ year: 1888 });

      const id1 = await createBookList(bookData1);
      const id2 = await createBookList(bookData2);

      const dataToChange = { url: 'some url', pendingUrl: 'some other url' };
      await updateBookList(id1, dataToChange);

      const expectedBookData1 = {
        ...bookData1,
        id: id1,
        url: 'some url',
        pendingUrl: 'some other url'
      };
      const expectedBookData2 = {
        ...bookData2,
        id: id2
      };

      const bookListsInDb = await getBookListsWithProps();

      expect(bookListsInDb).toEqual(jasmine.arrayWithExactContents([expectedBookData1, expectedBookData2]));
    });
  });

  describe('getBookListById', () => {
    it('returns the book list with the given id', async () => {
      const bookListData = generateRandomBookList();
      const id = await createBookList(bookListData);

      const result = await getBookListById(id);
      expect(result).toEqual({ id, ...bookListData });
    });

    it('returns null if there is no book list with the given id', async () => {
      const result = await getBookListById('does-not-exist');

      expect(result).toEqual(null);
    });
  });

  describe('getBookListsWithProps', () => {
    it('returns an empty array if there is no book list with the given properties', async () => {
      const bookListData1 = generateRandomBookList({ year: 1944 });
      const bookListData2 = generateRandomBookList({ year: 1956 });

      await createBookList(bookListData1);
      await createBookList(bookListData2);

      const bookLists = await getBookListsWithProps({ year: '1922' });

      expect(bookLists).toEqual([]);
    });

    it('returns all book lists if called with empty arg', async () => {
      const bookListData1 = generateRandomBookList({ year: 1922 });
      const bookListData2 = generateRandomBookList({ year: 1823 });
      const bookListData3 = generateRandomBookList({ year: 1888 });

      const id1 = await createBookList(bookListData1);
      const id2 = await createBookList(bookListData2);
      const id3 = await createBookList(bookListData3);

      const bookLists = await getBookListsWithProps();

      expect(bookLists).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...bookListData1 },
          { id: id2, ...bookListData2 },
          { id: id3, ...bookListData3 }
        ])
      );
    });

    it('returns the book lists with the given properties', async () => {
      const bookListData1 = generateRandomBookList({ year: 1933, genre: 'fantasy' });
      const bookListData2 = generateRandomBookList({ year: 1933, genre: 'scifi' });
      const bookListData3 = generateRandomBookList({ year: 1734, genre: 'fantasy' });

      const id1 = await createBookList(bookListData1);
      const id2 = await createBookList(bookListData2);
      await createBookList(bookListData3);

      const bookLists = await getBookListsWithProps({ year: 1933 });

      expect(bookLists).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...bookListData1 },
          { id: id2, ...bookListData2 }
        ])
      );
    });
  });

  describe('getBookListsOfBook', () => {
    it('returns the book lists of the given book', async () => {
      const bookListData1 = generateRandomBookList({ year: 1933, bookIds: ['4', '1', '3'] });
      const bookListData2 = generateRandomBookList({ year: 1935, bookIds: ['4', '7', '2', '1'] });
      const bookListData3 = generateRandomBookList({ year: 1734, bookIds: ['7', '3'] });

      const id1 = await createBookList(bookListData1);
      await createBookList(bookListData2);
      const id3 = await createBookList(bookListData3);

      const bookLists = await getBookListsOfBook('3');

      expect(bookLists).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...bookListData1 },
          { id: id3, ...bookListData3 }
        ])
      );
    });
  });

  describe('getBookListsOfJuryMember', () => {
    it('returns the book lists where the given user is a jury member', async () => {
      const bookListData1 = generateRandomBookList({ year: 1933, juryIds: ['4', '1', '3'] });
      const bookListData2 = generateRandomBookList({ year: 1935, juryIds: ['4', '7', '2', '1'] });
      const bookListData3 = generateRandomBookList({ year: 1734, juryIds: ['7', '3'] });

      const id1 = await createBookList(bookListData1);
      await createBookList(bookListData2);
      const id3 = await createBookList(bookListData3);

      const bookLists = await getBookListsOfJuryMember('3');

      expect(bookLists).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...bookListData1 },
          { id: id3, ...bookListData3 }
        ])
      );
    });
  });

  describe('updateBookListsOfJuryMember', () => {
    it('adds the jury member to the given book lists and removes from all others', async () => {
      const bookListData1 = generateRandomBookList({ year: 1933, juryIds: ['3', '1', '4'] });
      const bookListData2 = generateRandomBookList({ year: 1935, juryIds: ['7', '2', '1'] });
      const bookListData3 = generateRandomBookList({ year: 1734, juryIds: ['3', '7'] });

      const id1 = await createBookList(bookListData1);
      const id2 = await createBookList(bookListData2);
      const id3 = await createBookList(bookListData3);

      await updateBookListsOfJuryMember('4', [id2, id3]);

      const bookLists = await getBookListsWithProps();

      expect(bookLists).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...bookListData1, juryIds: jasmine.arrayWithExactContents(['3', '1']) },
          { id: id2, ...bookListData2, juryIds: jasmine.arrayWithExactContents(['7', '2', '1', '4']) },
          { id: id3, ...bookListData3, juryIds: jasmine.arrayWithExactContents(['3', '7', '4']) }
        ])
      );
    });

    it('works even if user had no book lists earlier', async () => {
      const bookListData1 = generateRandomBookList({ year: 1933, juryIds: ['3', '1'] });
      const bookListData2 = generateRandomBookList({ year: 1935, juryIds: ['7', '2', '1'] });
      const bookListData3 = generateRandomBookList({ year: 1734, juryIds: ['3', '7'] });

      const id1 = await createBookList(bookListData1);
      const id2 = await createBookList(bookListData2);
      const id3 = await createBookList(bookListData3);

      await updateBookListsOfJuryMember('4', [id2, id3]);

      const bookLists = await getBookListsWithProps();

      expect(bookLists).toEqual(
        jasmine.arrayWithExactContents([
          { id: id1, ...bookListData1, juryIds: jasmine.arrayWithExactContents(['3', '1']) },
          { id: id2, ...bookListData2, juryIds: jasmine.arrayWithExactContents(['7', '2', '1', '4']) },
          { id: id3, ...bookListData3, juryIds: jasmine.arrayWithExactContents(['3', '7', '4']) }
        ])
      );
    });
  });
});
