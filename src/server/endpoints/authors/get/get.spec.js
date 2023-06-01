'use strict';

const request = require('supertest');
const app = require('../../../app');
const {
  generateRandomUser,
  generateRandomAuthor
} = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createAuthor } = require('../../../dao/authors/authors');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('GET /authors/:authorId', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('authors')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/authors/something').expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const authorData = generateRandomAuthor();
    const authorId = await createAuthor(authorData);

    await request(app.listen())
      .get(`/api/authors/${authorId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('responds with 404 if an author with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const noId = 'badId';

    await request(app.listen())
      .get(`/api/authors/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(404);
  });

  it('returns with 200 with the author data if the user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const authorData = generateRandomAuthor();
    const authorId = await createAuthor(authorData);

    const response = await request(app.listen())
      .get(`/api/authors/${authorId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(200);

    expect(response.body.authorData).toEqual({ id: authorId, ...authorData });
  });
});
