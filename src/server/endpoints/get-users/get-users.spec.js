'use strict';

const request = require('supertest');
const app = require('../../app');
const { generateRandomUser } = require('../../../../scripts/generate-data');
const { createUser } = require('../../dao/user/user');
const { clearCollection } = require('../../../../test-helpers/firestore');

describe('GET /users', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  it('returns with 200 with the user list', async () => {
    const userData1 = generateRandomUser();
    const userData2 = generateRandomUser();
    const userId1 = await createUser(userData1);
    const userId2 = await createUser(userData2);

    userData1.id = userId1;
    userData2.id = userId2;

    const response = await request(app.listen())
      .get('/users')
      .expect(200);

    expect(response.body).toEqual(jasmine.arrayWithExactContents([userData1, userData2]));
  });
});
