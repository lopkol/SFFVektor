'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { createAuthor } = require('../../../../server/dao/authors/authors');
const { setBooks, getBooksByIds } = require('../../../../server/dao/books/books');
const { createBookAlternative } = require('../../../../server/dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { 
  generateRandomAuthor, 
  generateRandomUser, 
  generateRandomBookAlternative,
  generateRandomBook
} = require('../../../../../test-helpers/generate-data');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

const { getBooks, updateBook } = require('./books');

describe('client-side book list related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('authors'),
      clearCollection('bookAlternatives')
    ]);
  });

  afterEach(async () => {
    logUserOut();
  });

  describe('getBooks', () => {
    it('returns the books from the given year', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const authorData1 = generateRandomAuthor();
      const authorData2 = generateRandomAuthor();
      const authorId1 = await createAuthor(authorData1);
      const authorId2 = await createAuthor(authorData2);

      const alternativeData1 = await generateRandomBookAlternative();
      const alternativeData2 = await generateRandomBookAlternative();
      const alternativeData3 = await generateRandomBookAlternative();
      const alternativeId1 = await createBookAlternative(alternativeData1);
      const alternativeId2 = await createBookAlternative(alternativeData2);
      const alternativeId3 = await createBookAlternative(alternativeData3);

      const year = '2020';

      const bookData0 = generateRandomBook({ year: '1999' });
      const bookData1 = generateRandomBook({ year, authorIds: [authorId1], alternativeIds: [alternativeId1] });
      const bookData2 = generateRandomBook({ year, authorIds: [authorId2], alternativeIds: [alternativeId2, alternativeId3] });
      await setBooks([bookData0, bookData1, bookData2]);

      const books = await getBooks(year);

      const expectedData = jasmine.arrayWithExactContents([
        { 
          ...bookData1, 
          authors: [{ id: authorId1, ...authorData1 }], 
          alternatives: [{ id: alternativeId1, ...alternativeData1 }] 
        },
        { 
          ...bookData2, 
          authors: [{ id: authorId2, ...authorData2 }], 
          alternatives: jasmine.arrayWithExactContents([
            { id: alternativeId2, ...alternativeData2 }, 
            { id: alternativeId3, ...alternativeData3 }
          ]) 
        }
      ]);

      expect(books).toEqual(expectedData);
    }));
  });

  describe('updateBook', () => {
    it('updates the book list data correctly', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const bookData = generateRandomBook();
      const bookId = bookData.id;
      await setBooks([bookData]);

      const dataToUpdate = { title: 'unikornis', series: 'cica' };

      const updatedData = await updateBook(bookId, dataToUpdate);
      const [bookInDb] = await getBooksByIds([bookId]);

      const expectedData = { ...bookData, ...dataToUpdate };

      expect(bookInDb).toEqual(expectedData);
      expect(updatedData).toEqual(expectedData);
    }));
  });
});
