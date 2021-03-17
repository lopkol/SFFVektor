'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('GET /users', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .get('/api/users')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .get('/api/users')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('returns with 200 with the user list if the user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);
    const userData1 = generateRandomUser();
    const userData2 = generateRandomUser();
    const userId1 = await createUser(userData1);
    const userId2 = await createUser(userData2);

    const response = await request(app.listen())
      .get('/api/users')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(200);

    expect(response.body.userList).toEqual(jasmine.arrayWithExactContents([
      { id, ...userData },
      { id: userId1, ...userData1 }, 
      { id: userId2, ...userData2 }
    ]));
  });
});
