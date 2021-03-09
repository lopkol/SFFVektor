'use strict';

const request = require('supertest');
const app = require('../../app');
const { generateRandomUser } = require('../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../test-helpers/authorization');
const { createUser } = require('../../dao/users/users');
const { clearCollection } = require('../../../../test-helpers/firestore');

describe('GET /users', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .get('/api/users')
      .expect(401);
  });

  it('returns with 200 with the user list', async () => {
    const userData1 = generateRandomUser();
    const userData2 = generateRandomUser();
    const userId1 = await createUser(userData1);
    const userId2 = await createUser(userData2);

    userData1.id = userId1;
    userData2.id = userId2;

    const response = await request(app.listen())
      .get('/api/users')
      .set('Cookie', [createAuthorizationCookie({ id: '1', role: 'admin' })])
      .expect(200);

    expect(response.body).toEqual(jasmine.arrayWithExactContents([userData1, userData2]));
  });
});
