'use strict';

const { 
  createBookList,
  updateBookList,
  getBookListsWithProps,
  getBookListsOfJuryMember 
} = require('./book-lists');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomBookList } = require('../../../../test-helpers/generate-data');

describe('booklists DAO', () => {
  beforeEach(async () => {
    await clearCollection('bookLists');
  });

  describe('createBookList', () => {
    it('creates a booklist with the given properties', async () => {
      const bookListData = generateRandomBookList();
      const id = await createBookList(bookListData);

      const bookListsInDb = await getBookListsWithProps();
      expect(bookListsInDb).toEqual([{ id, ...bookListData }]);
    });

    it('returns null if a booklist with the same year and genre already exists', async () => {
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

    it('returns the booklist data with the correctly updated properties', async () => {
      const bookListData = generateRandomBookList();
      const id = await createBookList(bookListData);

      const res = await updateBookList(id, { url: 'some url' });

      expect(res).toEqual({
        ...bookListData,
        id,
        url: 'some url'
      });
    });

    it('updates the correct booklist and only the given properties', async () => {
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

  describe('getBooksWithProps', () => {
    it('returns an empty array if there is no book with the given properties', async () => {
      const bookListData1 = generateRandomBookList({ year: 1944 });
      const bookListData2 = generateRandomBookList({ year: 1956 });

      await createBookList(bookListData1);
      await createBookList(bookListData2);

      const bookLists = await getBookListsWithProps({ year: '1922' });

      expect(bookLists).toEqual([]);
    });

    it('returns all books if called with empty arg', async () => {
      const bookListData1 = generateRandomBookList({ year: 1922 });
      const bookListData2 = generateRandomBookList({ year: 1823 });
      const bookListData3 = generateRandomBookList({ year: 1888 });
      
      const id1 = await createBookList(bookListData1);
      const id2 = await createBookList(bookListData2);
      const id3 = await createBookList(bookListData3);

      const bookLists = await getBookListsWithProps();

      expect(bookLists).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...bookListData1 }, 
        { id: id2, ...bookListData2 }, 
        { id: id3, ...bookListData3 }
      ]));
    });

    it('returns the books with the given properties', async () => {
      const bookListData1 = generateRandomBookList({ year: 1933, genre: 'fantasy' });
      const bookListData2 = generateRandomBookList({ year: 1933, genre: 'scifi' });
      const bookListData3 = generateRandomBookList({ year: 1734, genre: 'fantasy' });
      
      const id1 = await createBookList(bookListData1);
      const id2 = await createBookList(bookListData2);
      await createBookList(bookListData3);

      const bookLists = await getBookListsWithProps({ year: 1933 });

      expect(bookLists).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...bookListData1 },
        { id: id2, ...bookListData2 }
      ]));
    });
  });

  describe('getBookListsOfJuryMember', () => {
    it('returns the booklists where the given user is a jury member', async () => {
      const bookListData1 = generateRandomBookList({ year: 1933, jury: ['3', '4', '1'] });
      const bookListData2 = generateRandomBookList({ year: 1935, jury: ['4', '7', '2', '1'] });
      const bookListData3 = generateRandomBookList({ year: 1734, jury: ['3', '7'] });

      const id1 = await createBookList(bookListData1);
      await createBookList(bookListData2);
      const id3 = await createBookList(bookListData3);

      const bookLists = await getBookListsOfJuryMember('3');

      expect(bookLists).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...bookListData1 },
        { id: id3, ...bookListData3 }
      ]));
    });
  });
});
