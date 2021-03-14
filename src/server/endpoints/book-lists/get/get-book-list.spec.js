'use strict';

const request = require('supertest');
const app = require('../../../app');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const { setBooks } = require('../../../dao/books/books');
const { createAuthor } = require('../../../dao/authors/authors');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { 
  generateRandomAuthor, 
  generateRandomUser, 
  generateRandomBook, 
  generateRandomBookList 
} = require('../../../../../test-helpers/generate-data');

describe('GET /book-lists/:year/:genre', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookLists'),
      clearCollection('authors')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .get('/api/users')
      .expect(401);
  });

  it('responds with 404 if the book list does not exist', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const userId = await createUser(userData);

    await request(app.listen())
      .get('/api/book-lists/2000/fantasy')
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'user' })])
      .expect(404);
  });

  it('responds with 403 if the user is not allowed to see the book list', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const userId = await createUser(userData);

    const bookListData = generateRandomBookList({ juryIds: [] });
    const year = bookListData.year;
    const genre = bookListData.genre;
    await createBookList(bookListData);

    await request(app.listen())
      .get(`/api/book-lists/${year}/${genre}`)
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'user' })])
      .expect(403);
  });

  it('returns with 200 with the book list data if the user is a jury member of the book list', async () => {
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

    const bookData1 = generateRandomBook({ authorIds: [authorId1] });
    const bookData2 = generateRandomBook({ authorIds: [authorId2] });
    await setBooks([bookData1, bookData2]);

    const bookListData = await generateRandomBookList({ juryIds: [userId, userId2, userId3], bookIds: [bookData1.id, bookData2.id] });
    const year = bookListData.year;
    const genre = bookListData.genre;
    const bookListId = await createBookList(bookListData);

    const response = await request(app.listen())
      .get(`/api/book-lists/${year}/${genre}`)
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'user' })])
      .expect(200);

    const expectedData = {
      bookList: {
        id: bookListId,
        ...bookListData
      },
      books: jasmine.arrayWithExactContents([
        { ...bookData1, authors: [{ id: authorId1, ...authorData1 }] },
        { ...bookData2, authors: [{ id: authorId2, ...authorData2 }] }
      ]),
      jury: jasmine.arrayWithExactContents([
        { id: userId, ...userData }, 
        { id: userId2, ...userData2 }, 
        { id: userId3, ...userData3 } 
      ])
    };

    expect(response.body).toEqual(expectedData);
  });

  it('returns with 200 with the book list data if the user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const userId = await createUser(userData);

    const userData2 = generateRandomUser();
    const userData3 = generateRandomUser();
    const userId2 = await createUser(userData2);
    const userId3 = await createUser(userData3);

    const authorData1 = generateRandomAuthor();
    const authorData2 = generateRandomAuthor();
    const authorId1 = await createAuthor(authorData1);
    const authorId2 = await createAuthor(authorData2);

    const bookData1 = generateRandomBook({ authorIds: [authorId1] });
    const bookData2 = generateRandomBook({ authorIds: [authorId2] });
    await setBooks([bookData1, bookData2]);

    const bookListData = await generateRandomBookList({ juryIds: [userId2, userId3], bookIds: [bookData1.id, bookData2.id] });
    const year = bookListData.year;
    const genre = bookListData.genre;
    const bookListId = await createBookList(bookListData);

    const response = await request(app.listen())
      .get(`/api/book-lists/${year}/${genre}`)
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'admin' })])
      .expect(200);

    const expectedData = {
      bookList: {
        id: bookListId,
        ...bookListData
      },
      books: jasmine.arrayWithExactContents([
        { ...bookData1, authors: [{ id: authorId1, ...authorData1 }] },
        { ...bookData2, authors: [{ id: authorId2, ...authorData2 }] }
      ]),
      jury: jasmine.arrayWithExactContents([ 
        { id: userId2, ...userData2 }, 
        { id: userId3, ...userData3 } 
      ])
    };

    expect(response.body).toEqual(expectedData);
  });
});
