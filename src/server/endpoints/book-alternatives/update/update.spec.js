'use strict';

const request = require('supertest');
const app = require('../../../app');

const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const {
  createBookAlternative,
  getBookAlternativesByIds
} = require('../../../dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const {
  generateRandomUser,
  generateRandomBookAlternative
} = require('../../../../../test-helpers/generate-data');

describe('PATCH /book-alternatives/:bookAlternativeId', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('bookAlternatives')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).patch('/api/book-alternatives/something').expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookAlternative = generateRandomBookAlternative();
    const bookAlternativeId = await createBookAlternative(bookAlternative);

    const bookAlternativeDataToUpdate = { urls: ['new url'] };

    await request(app.listen())
      .patch(`/api/book-alternatives/${bookAlternativeId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ bookAlternativeData: bookAlternativeDataToUpdate })
      .expect(403);
  });

  it('responds with 404 if a book alternative with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookAlternativeData = generateRandomBookAlternative();
    const noId = 'bad ID';

    await request(app.listen())
      .patch(`/api/book-alternatives/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookAlternativeData })
      .expect(404);
  });

  it('updates the book alternative and responds with 200 and the updated data if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookAlternativeData = generateRandomBookAlternative();
    const bookAlternativeId = await createBookAlternative(bookAlternativeData);

    const dataToUpdate = { urls: ['cica', 'kutya'] };

    const response = await request(app.listen())
      .patch(`/api/book-alternatives/${bookAlternativeId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookAlternativeData: dataToUpdate })
      .expect(200);

    const updatedBookAlternativeData = response.body.bookAlternativeData;
    const [updatedBookAlternativeInDb] = await getBookAlternativesByIds([bookAlternativeId]);

    const expectedBookAlternativeData = {
      id: bookAlternativeId,
      ...bookAlternativeData,
      ...dataToUpdate
    };

    expect(updatedBookAlternativeData).toEqual(expectedBookAlternativeData);
    expect(updatedBookAlternativeInDb).toEqual(expectedBookAlternativeData);
  });
});
