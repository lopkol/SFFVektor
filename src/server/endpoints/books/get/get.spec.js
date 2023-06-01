'use strict';

const request = require('supertest');
const app = require('../../../app');

const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { setBooks } = require('../../../dao/books/books');
const { createAuthor } = require('../../../dao/authors/authors');
const { createBookAlternative } = require('../../../dao/book-alternatives/book-alternatives');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const {
  generateRandomUser,
  generateRandomAuthor,
  generateRandomBookAlternative,
  generateRandomBook,
  generateRandomBookList
} = require('../../../../../test-helpers/generate-data');

describe('GET /books/:bookId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookAlternatives'),
      clearCollection('authors'),
      clearCollection('bookLists')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/books/something').expect(401);
  });

  it('responds with 404 if a book with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const noId = 'badId';

    await request(app.listen())
      .get(`/api/books/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(404);
  });

  it('returns with 200 with the book data', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

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

    const bookData = generateRandomBook({
      authorIds: [authorId1, authorId2],
      alternativeIds: [alternativeId1, alternativeId2, alternativeId3]
    });
    const bookId = bookData.id;
    await setBooks([bookData]);

    const year = bookData.year;
    const bookListData1 = generateRandomBookList({
      year,
      genre: 'fantasy',
      bookIds: [bookId, '6', '3']
    });
    const bookListData2 = generateRandomBookList({
      year,
      genre: 'scifi',
      bookIds: ['4', bookId, '5']
    });
    const bookListId1 = await createBookList(bookListData1);
    const bookListId2 = await createBookList(bookListData2);

    const response = await request(app.listen())
      .get(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(200);

    expect(response.body.bookData).toEqual({
      ...bookData,
      authors: jasmine.arrayWithExactContents([
        { id: authorId1, ...authorData1 },
        { id: authorId2, ...authorData2 }
      ]),
      alternatives: jasmine.arrayWithExactContents([
        { id: alternativeId1, ...alternativeData1 },
        { id: alternativeId2, ...alternativeData2 },
        { id: alternativeId3, ...alternativeData3 }
      ]),
      bookLists: jasmine.arrayWithExactContents([
        { id: bookListId1, ...bookListData1 },
        { id: bookListId2, ...bookListData2 }
      ])
    });
  });
});
