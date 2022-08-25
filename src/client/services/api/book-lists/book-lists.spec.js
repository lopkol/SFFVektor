'use strict';

const nock = require('nock');
const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { createAuthor, getAuthorById } = require('../../../../server/dao/authors/authors');
const { setBooks, getBooksWithProps } = require('../../../../server/dao/books/books');
const { createBookList, getBookListById, getBookListsWithProps } = require('../../../../server/dao/book-lists/book-lists');
const { createBookAlternative, getBookAlternativesByIds } = require('../../../../server/dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const {
  generateRandomAuthor,
  generateRandomUser,
  generateRandomBookAlternative,
  generateRandomBook,
  generateRandomBookList
} = require('../../../../../test-helpers/generate-data');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');
const {
  bookListUrl,
  pendingUrl,
  bookUrls,
  book1,
  book2,
  book3,
  book4,
  authors,
  hunVersions,
  originalVersions,
  bookListPage,
  pendingPage,
  bookPage1,
  bookPage2,
  bookPage3,
  bookPage4
} = require('../../../../../test-helpers/moly/book-list-moly-update');
const { moly } = require('../../../../server/config');

const { getBookList, getBookLists, updateBookList, saveBookList, updateBookListFromMoly } = require('./book-lists');

describe('client-side book list related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookLists'),
      clearCollection('authors'),
      clearCollection('bookAlternatives')
    ]);
  });

  afterEach(async () => {
    logUserOut();
  });

  describe('getBookList', () => {
    it('returns the book list data', withServer(async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'user' });

      const userData2 = generateRandomUser();
      const userData3 = generateRandomUser();
      const userId2 = await createUser(userData2);
      const userId3 = await createUser(userData3);

      const authorData1 = generateRandomAuthor();
      const authorData2 = generateRandomAuthor();
      const authorId1 = await createAuthor(authorData1);
      const authorId2 = await createAuthor(authorData2);

      const alternativeData1 = await generateRandomBookAlternative();
      const alternativeData2 = await generateRandomBookAlternative();
      const alternativeId1 = await createBookAlternative(alternativeData1);
      const alternativeId2 = await createBookAlternative(alternativeData2);

      const bookData1 = generateRandomBook({ authorIds: [authorId1], alternativeIds: [alternativeId1] });
      const bookData2 = generateRandomBook({ authorIds: [authorId2], alternativeIds: [alternativeId2] });
      await setBooks([bookData1, bookData2]);

      const bookListData = await generateRandomBookList({ juryIds: [userId2, userId3], bookIds: [bookData1.id, bookData2.id] });
      const bookListId = await createBookList(bookListData);

      const bookList = await getBookList(bookListId);

      const expectedData = {
        bookList: {
          id: bookListId,
          ...bookListData
        },
        books: jasmine.arrayWithExactContents([
          { ...bookData1, authors: [{ id: authorId1, ...authorData1 }], alternatives: [{ id: alternativeId1, ...alternativeData1 }] },
          { ...bookData2, authors: [{ id: authorId2, ...authorData2 }], alternatives: [{ id: alternativeId2, ...alternativeData2 }] }
        ]),
        jury: jasmine.arrayWithExactContents([
          { id: userId2, ...userData2 },
          { id: userId3, ...userData3 }
        ])
      };

      expect(bookList).toEqual(expectedData);
    }));
  });

  describe('getBookLists', () => {
    it('returns the book lists', withServer(async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'user' });

      const bookListData1 = await generateRandomBookList({ year: '2020', genre: 'fantasy' });
      const bookListData2 = await generateRandomBookList({ year: '2020', genre: 'scifi' });
      const bookListData3 = await generateRandomBookList({ year: '2019', genre: 'scifi' });
      const bookListId1 = await createBookList(bookListData1);
      const bookListId2 = await createBookList(bookListData2);
      const bookListId3 = await createBookList(bookListData3);

      const bookLists = await getBookLists();

      const expectedData = jasmine.arrayWithExactContents([
        { id: bookListId1, ...bookListData1 },
        { id: bookListId2, ...bookListData2 },
        { id: bookListId3, ...bookListData3 }
      ]);

      expect(bookLists).toEqual(expectedData);
    }));
  });

  describe('updateBookList', () => {
    it('updates the book list data correctly', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const bookList = generateRandomBookList();
      const bookListId = await createBookList(bookList);
      const dataToUpdate = { url: 'new url', archived: true };

      const updatedData = await updateBookList(bookListId, dataToUpdate);
      const bookListsInDb = await getBookListsWithProps();

      const expectedData = { id: bookListId, ...bookList, ...dataToUpdate };

      expect(bookListsInDb).toEqual([expectedData]);
      expect(updatedData).toEqual(expectedData);
    }));
  });

  describe('saveBookList', () => {
    it('creates a new book list with the given data', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const bookListData = generateRandomBookList();
      const newId = await saveBookList(bookListData);

      const bookListsInDb = await getBookListsWithProps();

      expect(bookListsInDb).toEqual([{ id: newId, ...bookListData }]);
    }));
  });

  describe('updateBookListFromMoly', () => {
    it('updates the book list data from the moly list', withServer(async () => {
      const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
      nock(moly.baseUrl)
        .get(bookListUrl).reply(200, bookListPage)
        .get(pendingUrl).reply(200, pendingPage)
        .get(bookUrls[0]).reply(200, bookPage1)
        .get(bookUrls[1]).reply(200, bookPage2)
        .get(bookUrls[2]).reply(200, bookPage3)
        .get(bookUrls[3]).reply(200, bookPage4);

      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const year = '2020';
      const genre = 'scifi';
      const bookListData = generateRandomBookList({
        year,
        genre,
        url: moly.baseUrl + bookListUrl,
        pendingUrl: moly.baseUrl + pendingUrl,
        juryIds: [],
        bookIds: []
      });
      const bookListId = await createBookList(bookListData);
      await updateBookListFromMoly(bookListId);

      const bookList = await getBookListById(bookListId);

      const booksInDb = await getBooksWithProps();
      expect(bookList.bookIds).toEqual(jasmine.arrayWithExactContents(booksInDb.map(book => book.id)));

      await Promise.all([book1, book2, book3, book4].map(async (book, index) => {
        const [bookInDb] = await getBooksWithProps({ title: book.title });
        expect(bookInDb).toEqual(jasmine.objectContaining(book));

        const [authorId] = bookInDb.authorIds;
        const author = await getAuthorById(authorId);
        expect(author).toEqual(jasmine.objectContaining(authors[index]));

        const alternativeIds = bookInDb.alternativeIds;
        const alternatives = await getBookAlternativesByIds(alternativeIds);
        if (index === 2) {
          expect(alternatives).toEqual([jasmine.objectContaining(hunVersions[2])]);
        } else {
          expect(alternatives).toEqual(jasmine.arrayWithExactContents([
            jasmine.objectContaining(hunVersions[index]),
            jasmine.objectContaining(originalVersions[index])
          ]));
        }
      }));

      nock.cleanAll();
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    }));
  });
});
