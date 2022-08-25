'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { createAuthor } = require('../../../../server/dao/authors/authors');
const { setBooks, getBooksByIds } = require('../../../../server/dao/books/books');
const { createBookAlternative, getBookAlternativesWithProps } = require('../../../../server/dao/book-alternatives/book-alternatives');
const { createBookList } = require('../../../../server/dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const {
  generateRandomAuthor,
  generateRandomUser,
  generateRandomBookAlternative,
  generateRandomBook,
  generateRandomBookList
} = require('../../../../../test-helpers/generate-data');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

const { getBooks, getBook, updateBook } = require('./books');

describe('client-side book related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('authors'),
      clearCollection('bookAlternatives'),
      clearCollection('bookLists')
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

      const bookListData1 = generateRandomBookList({ year, genre: 'fantasy', bookIds: [bookData1.id, bookData2.id, '3'] });
      const bookListData2 = generateRandomBookList({ year, genre: 'scifi', bookIds: ['4', bookData1.id, '5'] });
      const bookListId1 = await createBookList(bookListData1);
      const bookListId2 = await createBookList(bookListData2);

      const books = await getBooks(year);

      const expectedData = jasmine.arrayWithExactContents([
        {
          ...bookData1,
          authors: [{ id: authorId1, ...authorData1 }],
          alternatives: [{ id: alternativeId1, ...alternativeData1 }],
          bookLists: jasmine.arrayWithExactContents([
            {
              ...bookListData1,
              id: bookListId1
            },
            {
              ...bookListData2,
              id: bookListId2
            }
          ])
        },
        {
          ...bookData2,
          authors: [{ id: authorId2, ...authorData2 }],
          alternatives: jasmine.arrayWithExactContents([
            { id: alternativeId2, ...alternativeData2 },
            { id: alternativeId3, ...alternativeData3 }
          ]),
          bookLists: [{
            ...bookListData1,
            id: bookListId1
          }]
        }
      ]);

      expect(books).toEqual(expectedData);
    }));
  });

  describe('getBook', () => {
    it('returns the book with the given id', withServer(async () => {
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

      const bookData = generateRandomBook({ authorIds: [authorId1, authorId2], alternativeIds: [alternativeId1, alternativeId2, alternativeId3] });
      const bookId = bookData.id;
      await setBooks([bookData]);

      const year = bookData.year;
      const bookListData1 = generateRandomBookList({ year, genre: 'fantasy', bookIds: [bookId, '6', '3'] });
      const bookListData2 = generateRandomBookList({ year, genre: 'scifi', bookIds: ['4', bookId, '5'] });
      const bookListId1 = await createBookList(bookListData1);
      const bookListId2 = await createBookList(bookListData2);

      const book = await getBook(bookId);

      expect(book).toEqual({
        ...bookData,
        authors: jasmine.arrayWithExactContents([
          { id: authorId1, ...authorData1 },
          { id: authorId2, ...authorData2 }
        ]),
        alternatives: jasmine.arrayWithExactContents([
          { id: alternativeId1, ...alternativeData1 },
          { id: alternativeId2, ...alternativeData2 },
          { id: alternativeId3, ...alternativeData3 },
        ]),
        bookLists: jasmine.arrayWithExactContents([
          { id: bookListId1, ...bookListData1 },
          { id: bookListId2, ...bookListData2 }
        ])
      });
    }));
  });

  describe('updateBook', () => {
    it('updates the book data correctly', withServer(async () => {
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

    it('updates the alternatives correctly', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const bookAlternative1 = generateRandomBookAlternative();
      const bookAlternative2 = generateRandomBookAlternative();
      const alternativeId1 = await createBookAlternative(bookAlternative1);
      const alternativeId2 = await createBookAlternative(bookAlternative2);

      const previousAlternativeIds = [alternativeId1, alternativeId2];
      const bookData = generateRandomBook({ alternativeIds: previousAlternativeIds });
      const bookId = bookData.id;
      await setBooks([bookData]);

      const updatedBookAlt1 = generateRandomBookAlternative();
      const newBookAlt3 = generateRandomBookAlternative();
      const dataToUpdate = {
        alternativeIds: [alternativeId1, null],
        alternatives: [{ id: alternativeId1, ...updatedBookAlt1 }, newBookAlt3]
      };

      const updatedData = await updateBook(bookId, dataToUpdate, previousAlternativeIds);

      const alternativesInDb = await getBookAlternativesWithProps();
      const alternativeIdsInDb = alternativesInDb.map(alternative => alternative.id);

      const [bookInDb] = await getBooksByIds([bookId]);
      expect(bookInDb).toEqual(updatedData);
      expect(bookInDb.alternativeIds).toEqual(jasmine.arrayWithExactContents(alternativeIdsInDb));
      expect(bookInDb.alternativeIds).toContain(alternativeId1);
      expect(bookInDb.alternativeIds).not.toContain(alternativeId2);
    }));
  });
});
