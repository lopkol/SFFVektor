'use strict';

const request = require('supertest');
const app = require('../../../app');
const {
  generateRandomUser,
  generateRandomBookList
} = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList, getBookListById } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('POST /book-lists/new', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('bookLists')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).post('/api/book-lists/new').expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .post('/api/book-lists/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('responds with 400 if year or genre is empty', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const newBookListData = generateRandomBookList({ genre: '' });

    await request(app.listen())
      .post('/api/book-lists/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookListData: newBookListData })
      .expect(400);
  });

  it('creates a new book list and responds with 201 and the book list id if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const newBookListData = generateRandomBookList();

    const response = await request(app.listen())
      .post('/api/book-lists/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookListData: newBookListData })
      .expect(201);

    const newId = response.body.id;
    const savedBookList = await getBookListById(newId);
    expect(savedBookList).toEqual({ id: newId, ...newBookListData });
  });

  it('responds with 409 if a book list with the given year and genre already exists', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const year = '2021';
    const genre = 'scifi';
    const bookListData = generateRandomBookList({ year, genre });
    await createBookList(bookListData);
    const newBookListData = generateRandomBookList({ year, genre });

    await request(app.listen())
      .post('/api/book-lists/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookListData: newBookListData })
      .expect(409);
  });
});
