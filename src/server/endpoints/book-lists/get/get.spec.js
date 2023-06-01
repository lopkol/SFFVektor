'use strict';

const request = require('supertest');
const app = require('../../../app');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const { setBooks } = require('../../../dao/books/books');
const { createAuthor } = require('../../../dao/authors/authors');
const { createBookAlternative } = require('../../../dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const {
  generateRandomAuthor,
  generateRandomUser,
  generateRandomBookAlternative,
  generateRandomBook,
  generateRandomBookList
} = require('../../../../../test-helpers/generate-data');

describe('GET /book-lists/:bookListId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookLists'),
      clearCollection('authors'),
      clearCollection('bookAlternatives')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/book-lists/2000fantasy').expect(401);
  });

  it('responds with 404 if the book list does not exist', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const userId = await createUser(userData);

    await request(app.listen())
      .get('/api/book-lists/2000fantasy')
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'user' })])
      .expect(404);
  });

  it('returns with 200 with the book list data', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const userId = await createUser(userData);

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

    const bookData1 = generateRandomBook({
      authorIds: [authorId1],
      alternativeIds: [alternativeId1]
    });
    const bookData2 = generateRandomBook({
      authorIds: [authorId2],
      alternativeIds: [alternativeId2]
    });
    await setBooks([bookData1, bookData2]);

    const bookListData = await generateRandomBookList({
      juryIds: [userId2, userId3],
      bookIds: [bookData1.id, bookData2.id]
    });
    const bookListId = await createBookList(bookListData);

    const response = await request(app.listen())
      .get(`/api/book-lists/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'user' })])
      .expect(200);

    const expectedData = {
      bookList: {
        id: bookListId,
        ...bookListData
      },
      books: jasmine.arrayWithExactContents([
        {
          ...bookData1,
          authors: [{ id: authorId1, ...authorData1 }],
          alternatives: [{ id: alternativeId1, ...alternativeData1 }]
        },
        {
          ...bookData2,
          authors: [{ id: authorId2, ...authorData2 }],
          alternatives: [{ id: alternativeId2, ...alternativeData2 }]
        }
      ]),
      jury: jasmine.arrayWithExactContents([
        { id: userId2, ...userData2 },
        { id: userId3, ...userData3 }
      ])
    };

    expect(response.body).toEqual(expectedData);
  });
});
