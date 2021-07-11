'use strict';

const { omit } = require('lodash');
const request = require('supertest');
const app = require('../../../app');

const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { setBooks, getBooksByIds } = require('../../../dao/books/books');
const { createBookAlternative, getBookAlternativesWithProps } = require('../../../dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomUser, generateRandomBook, generateRandomBookAlternative } = require('../../../../../test-helpers/generate-data');

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

  it('deletes the alternatives that do not belong to the book anymore', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookAlternative1 = generateRandomBookAlternative();
    const bookAlternative2 = generateRandomBookAlternative();
    const alternativeId1 = await createBookAlternative(bookAlternative1);
    const alternativeId2 = await createBookAlternative(bookAlternative2);

    const previousAlternativeIds = [alternativeId1, alternativeId2];
    const bookData = generateRandomBook({ alternativeIds: previousAlternativeIds });
    const bookId = bookData.id;
    await setBooks([bookData]);

    const dataToUpdate = { alternativeIds: [], alternatives: [] };

    await request(app.listen())
      .patch(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookData: dataToUpdate, previousAlternativeIds })
      .expect(200);

    const alternativesInDb = await getBookAlternativesWithProps();
    expect(alternativesInDb).toEqual([]);
  });

  it('updates the alternatives correctly', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookAlternative1 = generateRandomBookAlternative();
    const bookAlternative2 = generateRandomBookAlternative();
    const alternativeId1 = await createBookAlternative(bookAlternative1);
    const alternativeId2 = await createBookAlternative(bookAlternative2);

    const previousAlternativeIds = [alternativeId1, alternativeId2];
    const bookData = generateRandomBook({ alternativeIds: previousAlternativeIds });
    const bookId = bookData.id;
    await setBooks([bookData]);

    const updatedBookAlt1 = generateRandomBookAlternative();
    const updatedBookAlt2 = generateRandomBookAlternative();
    const dataToUpdate = {
      alternativeIds: previousAlternativeIds,
      alternatives: [{ id: alternativeId1, ...updatedBookAlt1 }, { id: alternativeId2, ...updatedBookAlt2 }] 
    };

    await request(app.listen())
      .patch(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookData: dataToUpdate, previousAlternativeIds })
      .expect(200);

    const alternativesInDb = await getBookAlternativesWithProps();
    expect(alternativesInDb).toEqual(jasmine.arrayWithExactContents([
      { id: alternativeId1, ...updatedBookAlt1 },
      { id: alternativeId2, ...updatedBookAlt2 }
    ]));
  });

  it('creates the new alternatives', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookData = generateRandomBook();
    const bookId = bookData.id;
    await setBooks([bookData]);

    const newBookAlt1 = generateRandomBookAlternative();
    const newBookAlt2 = generateRandomBookAlternative();
    const dataToUpdate = {
      alternativeIds: [null, null],
      alternatives: [newBookAlt1, newBookAlt2] 
    };

    await request(app.listen())
      .patch(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookData: dataToUpdate, previousAlternativeIds: [] })
      .expect(200);

    const alternativesInDb = await getBookAlternativesWithProps();
    expect(alternativesInDb).toEqual(jasmine.arrayWithExactContents([
      jasmine.objectContaining(newBookAlt1),
      jasmine.objectContaining(newBookAlt2)
    ]));
  });

  it('updates the book alternative ids (on the book) correctly', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

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

    const response = await request(app.listen())
      .patch(`/api/books/${bookId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookData: dataToUpdate, previousAlternativeIds })
      .expect(200);

    const alternativesInDb = await getBookAlternativesWithProps();
    const alternativeIdsInDb = alternativesInDb.map(alternative => alternative.id);

    const [bookInDb] = await getBooksByIds([bookId]);
    expect(bookInDb).toEqual(response.body.bookData);
    expect(bookInDb.alternativeIds).toEqual(jasmine.arrayWithExactContents(alternativeIdsInDb));
    expect(bookInDb.alternativeIds).toContain(alternativeId1);
    expect(bookInDb.alternativeIds).not.toContain(alternativeId2);
  });
});
