'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookAlternative } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { getBookAlternativesByIds } = require('../../../dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('POST /book-alternatives/new', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookAlternatives')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .post('/api/book-alternatives/new')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .post('/api/book-alternatives/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('responds with 400 if name or urls is empty', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const newBookAlternativeData = generateRandomBookAlternative({ name: 'magyar', urls: [] });

    await request(app.listen())
      .post('/api/book-alternatives/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookAlternativeData: newBookAlternativeData })
      .expect(400);
  });

  it('creates a new book alternative and responds with 201 and the alternative id if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const newBookAlternativeData = generateRandomBookAlternative();

    const response = await request(app.listen())
      .post('/api/book-alternatives/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ bookAlternativeData: newBookAlternativeData })
      .expect(201);

    const newId = response.body.id;
    const [savedBookAlternative] = await getBookAlternativesByIds([newId]);
    expect(savedBookAlternative).toEqual({ id: newId, ...newBookAlternativeData });
  });
});
