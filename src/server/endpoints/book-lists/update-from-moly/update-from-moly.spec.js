'use strict';

const request = require('supertest');
const nock = require('nock');
const app = require('../../../app');
const { moly } = require('../../../config');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList, getBookListById } = require('../../../dao/book-lists/book-lists');
const { getBooksWithProps } = require('../../../dao/books/books');
const { getAuthorById } = require('../../../dao/authors/authors');
const { getBookAlternativesByIds } = require('../../../dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { 
  generateRandomUser,
  generateRandomBookList 
} = require('../../../../../test-helpers/generate-data');
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

describe('POST /book-lists/:bookListId/moly-update', () => {
  let originalTimeout;
  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookLists'),
      clearCollection('authors'),
      clearCollection('bookAlternatives')
    ]);

    nock(moly.baseUrl)
      .get(bookListUrl).reply(200, bookListPage)
      .get(pendingUrl).reply(200, pendingPage)
      .get(bookUrls[0]).reply(200, bookPage1)
      .get(bookUrls[1]).reply(200, bookPage2)
      .get(bookUrls[2]).reply(200, bookPage3)
      .get(bookUrls[3]).reply(200, bookPage4);
  });

  afterEach(() => {
    nock.cleanAll();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .post('/api/book-lists/2000scifi/moly-update')
      .expect(401);
  });

  it('responds with 404 if the book list does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const userId = await createUser(userData);

    await request(app.listen())
      .post('/api/book-lists/1991scifi/moly-update')
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'admin' })])
      .expect(404);
  });

  it('responds with 403 if the user is not allowed to trigger update', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const userId = await createUser(userData);

    const bookListData = generateRandomBookList({ juryIds: [] });
    const bookListId = await createBookList(bookListData);

    await request(app.listen())
      .post(`/api/book-lists/${bookListId}/moly-update`)
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'user' })])
      .expect(403);
  });

  it('responds with 200 and creates the books, authors, alternatives if they did not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const userId = await createUser(userData);

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

    await request(app.listen())
      .post(`/api/book-lists/${bookListId}/moly-update`)
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'admin' })])
      .expect(200);

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
  });

  //TODO: more tests
});
