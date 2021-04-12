'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookList } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList, getBookListById } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('PATCH /book-lists/:bookListId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .patch('/api/book-lists/something')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookList = generateRandomBookList({ year: '1999' });
    const bookListId = await createBookList(bookList);

    const bookListDataToUpdate = { url: 'new url' };

    await request(app.listen())
      .patch(`/api/book-lists/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ bookListData: bookListDataToUpdate })
      .expect(403);
  });

  it('responds with 404 if a book list with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookListData = generateRandomBookList();
    const noId = 'bad ID';

    await request(app.listen())
      .patch(`/api/book-lists/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookListData })
      .expect(404);
  });

  it('updates the book list and responds with 200 and the updated data if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookListData = generateRandomBookList();
    const bookListId = await createBookList(bookListData);

    const dataToUpdate = { url: 'unikornis', pendingUrl: 'cica' };

    const response = await request(app.listen())
      .patch(`/api/book-lists/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookListData: dataToUpdate })
      .expect(200);

    const updatedBookListData = response.body.bookList;
    const updatedBookListInDb = await getBookListById(bookListId);

    const expectedUserData = { id: bookListId, ...bookListData, ...dataToUpdate };

    expect(updatedBookListData).toEqual(expectedUserData);
    expect(updatedBookListInDb).toEqual(expectedUserData);
  });

  it('does not update the year and genre', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookListData = generateRandomBookList();
    const bookListId = await createBookList(bookListData);

    const dataToUpdate = { year: 'unikornis', genre: 'cica', url: 'some url' };

    const response = await request(app.listen())
      .patch(`/api/book-lists/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookListData: dataToUpdate })
      .expect(200);

    const updatedBookListData = response.body.bookList;
    const updatedBookListInDb = await getBookListById(bookListId);

    const expectedUserData = { id: bookListId, ...bookListData, url: 'some url' };

    expect(updatedBookListData).toEqual(expectedUserData);
    expect(updatedBookListInDb).toEqual(expectedUserData);
  });
});
