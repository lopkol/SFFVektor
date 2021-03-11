'use strict';

const { omit } = require('lodash');
const { createBook, setBooks, getBooksByIds, getBooksWithProps } = require('./books');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomBook } = require('../../../../test-helpers/generate-data');

describe('books DAO', () => {
  beforeEach(async () => {
    await clearCollection('books');
  });

  describe('createBook', () => {
    it('creates a book with the given properties', async () => {
      const bookData = omit(generateRandomBook(), 'id');
      const id = await createBook(bookData);
      const booksInDb = await getBooksWithProps();

      expect(booksInDb).toEqual([{ id, ...bookData }]);
    });
  });

  describe('setBooks', () => {
    it('creates books with the given properties if they do not exist', async () => {
      const bookData1 = generateRandomBook({ id: '1' });
      const bookData2 = generateRandomBook({ id: '2' });

      await setBooks([bookData1, bookData2]);
      const booksInDb = await getBooksWithProps();

      expect(booksInDb).toEqual(jasmine.arrayWithExactContents([bookData1, bookData2]));
    });

    it('updates the correct books and only the given properties', async () => {
      const bookData1 = generateRandomBook({ id: '1' });
      const bookData2 = generateRandomBook({ id: '2' });
      const bookData3 = generateRandomBook({ id: '3' });
      
      await setBooks([bookData1, bookData2, bookData3]);

      const dataToChange2 = { id: '2', authorId: '3', title: 'War and Peace' };
      const dataToChange3 = { id: '3', series: '' };
      await setBooks([dataToChange2, dataToChange3]);

      const expectedBookData2 = {
        ...bookData2,
        ...dataToChange2
      };
      const expectedBookData3 = {
        ...bookData3,
        ...dataToChange3
      };

      const booksInDb = await getBooksWithProps();

      expect(booksInDb).toEqual(jasmine.arrayWithExactContents([bookData1, expectedBookData2, expectedBookData3]));
    });
  });

  describe('getBooksByIds', () => {
    it('returns the books with the given ids, in the correct order', async () => {
      const bookData1 = generateRandomBook({ id: '1' });
      const bookData2 = generateRandomBook({ id: '2' });
      const bookData3 = generateRandomBook({ id: '3' });
      
      await setBooks([bookData1, bookData2, bookData3]);

      const books = await getBooksByIds(['3', '1']);

      expect(books).toEqual([bookData3, bookData1]);
    });

    it('returns null in place of books that do not exist', async () => {
      const bookData1 = generateRandomBook({ id: '1' });
      const bookData2 = generateRandomBook({ id: '2' });

      await setBooks([bookData1, bookData2]);

      const books = await getBooksByIds(['3', '1']);

      expect(books).toEqual([null, bookData1]);
    });
  });

  describe('getBooksWithProps', () => {
    it('returns an empty array if there is no book with the given properties', async () => {
      const bookData1 = generateRandomBook({ title: 'War and Peace' });
      const bookData2 = generateRandomBook({ title: 'Harry Potter' });
      const bookData3 = generateRandomBook({ title: 'Twilight' });

      await setBooks([bookData1, bookData2, bookData3]);

      const books = await getBooksWithProps({ title: 'some other title' });

      expect(books).toEqual([]);
    });

    it('returns all books if called with empty arg', async () => {
      const bookData1 = generateRandomBook({ id: '1' });
      const bookData2 = generateRandomBook({ id: '2' });
      const bookData3 = generateRandomBook({ id: '3' });
      
      await setBooks([bookData1, bookData2, bookData3]);

      const books = await getBooksWithProps();

      expect(books).toEqual(jasmine.arrayWithExactContents([bookData1, bookData2, bookData3]));
    });

    it('returns the books with the given properties', async () => {
      const bookData1 = generateRandomBook({ authorId: '22', series: 'Harry Potter', isApproved: false });
      const bookData2 = generateRandomBook({ authorId: '22', series: 'Harry Potter', isApproved: true });
      const bookData3 = generateRandomBook({ authorId: '1', series: 'Lord of the Rings', isApproved: false });
      const bookData4 = generateRandomBook({ authorId: '3', series: 'Harry Potter', isApproved: false });
      const bookData5 = generateRandomBook({ authorId: '22', series: 'Harry Potter', isApproved: false });

      await setBooks([bookData1, bookData2, bookData3, bookData4, bookData5]);

      const books = await getBooksWithProps({ authorId: '22', series: 'Harry Potter', isApproved: false });

      expect(books).toEqual(jasmine.arrayWithExactContents([bookData1, bookData5]));
    });
  });
});
