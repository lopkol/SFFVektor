'use strict';

const request = require('supertest');
const app = require('../../../app');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createAuthor } = require('../../../dao/authors/authors');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const {
  generateRandomUser,
  generateRandomAuthor
} = require('../../../../../test-helpers/generate-data');

describe('GET /authors', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('authors')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/authors').expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .get('/api/authors')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('returns with 200 with the author list', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const userId = await createUser(userData);

    const authorData1 = await generateRandomAuthor();
    const authorData2 = await generateRandomAuthor();
    const authorData3 = await generateRandomAuthor();
    const authorId1 = await createAuthor(authorData1);
    const authorId2 = await createAuthor(authorData2);
    const authorId3 = await createAuthor(authorData3);

    const response = await request(app.listen())
      .get('/api/authors')
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'admin' })])
      .expect(200);

    const expectedData = {
      authors: jasmine.arrayWithExactContents([
        { id: authorId1, ...authorData1 },
        { id: authorId2, ...authorData2 },
        { id: authorId3, ...authorData3 }
      ])
    };

    expect(response.body).toEqual(expectedData);
  });
});
