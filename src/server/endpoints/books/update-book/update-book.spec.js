'use strict';

const { omit } = require('lodash');
const request = require('supertest');
const app = require('../../../app');

const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { setBooks, getBooksByIds } = require('../../../dao/books/books');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomUser, generateRandomBook } = require('../../../../../test-helpers/generate-data');

describe('PATCH /books/:bookId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookAlternatives'),
      clearCollection('authors')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .patch('/api/books/something')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .patch('/api/books/something')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ bookData: {} })
      .expect(403);
  });

  it('responds with 404 if a book with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookData = omit(generateRandomBook(), 'id');
    const noId = 'bad ID';

    await request(app.listen())
      .patch(`/api/books/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookData })
      .expect(404);
  });

  it('responds with 400 if no data is sent', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookData = generateRandomBook();
    const bookId = bookData.id;
    await setBooks([bookData]);

    await request(app.listen())
      .patch(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(400);
  });

  it('updates the book and responds with 200 and the updated data if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookData = generateRandomBook();
    const bookId = bookData.id;
    await setBooks([bookData]);

    const dataToUpdate = { title: 'unikornis', series: 'cica' };

    const response = await request(app.listen())
      .patch(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookData: dataToUpdate })
      .expect(200);

    const updatedBookData = response.body.bookData;
    const [updatedBookInDb] = await getBooksByIds([bookId]);

    const expectedBookData = { ...bookData, ...dataToUpdate };

    expect(updatedBookData).toEqual(expectedBookData);
    expect(updatedBookInDb).toEqual(expectedBookData);
  });

  it('does not update the year and isPending', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookData = generateRandomBook({ isPending: false });
    const bookId = bookData.id;
    await setBooks([bookData]);

    const dataToUpdate = { year: '1999', isPending: true, title: 'unikornis' };

    const response = await request(app.listen())
      .patch(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookData: dataToUpdate })
      .expect(200);

    const updatedBookData = response.body.bookData;
    const [updatedBookInDb] = await getBooksByIds([bookId]);

    const expectedBookData = { ...bookData, title: 'unikornis' };

    expect(updatedBookData).toEqual(expectedBookData);
    expect(updatedBookInDb).toEqual(expectedBookData);
  });
});
