'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookAlternative } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookAlternative } = require('../../../dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('GET /book-alternatives/:bookAlternativeId', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('bookAlternatives')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/book-alternatives/something').expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookAlternativeData = generateRandomBookAlternative();
    const bookAlternativeId = await createBookAlternative(bookAlternativeData);

    await request(app.listen())
      .get(`/api/book-alternatives/${bookAlternativeId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('responds with 404 if a book alternative with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const noId = 'badId';

    await request(app.listen())
      .get(`/api/book-alternatives/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(404);
  });

  it('returns with 200 with the book alternative data if the user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const bookAlternativeData = generateRandomBookAlternative();
    const bookAlternativeId = await createBookAlternative(bookAlternativeData);

    const response = await request(app.listen())
      .get(`/api/book-alternatives/${bookAlternativeId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(200);

    expect(response.body.bookAlternativeData).toEqual({ id: bookAlternativeId, ...bookAlternativeData });
  });
});
