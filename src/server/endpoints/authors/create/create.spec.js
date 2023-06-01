'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomAuthor } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { getAuthorById } = require('../../../dao/authors/authors');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('POST /authors/new', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('authors')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).post('/api/authors/new').expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .post('/api/authors/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('responds with 400 if name or sortName is empty', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const newAuthorData = generateRandomAuthor({ name: '', sortName: 'Potter, Harry' });

    await request(app.listen())
      .post('/api/authors/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ authorData: newAuthorData })
      .expect(400);
  });

  it('creates a new author and responds with 201 and the author id if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const newAuthorData = generateRandomAuthor();

    const response = await request(app.listen())
      .post('/api/authors/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ authorData: newAuthorData })
      .expect(201);

    const newId = response.body.id;
    const savedAuthor = await getAuthorById(newId);
    expect(savedAuthor).toEqual({ id: newId, ...newAuthorData });
  });
});
