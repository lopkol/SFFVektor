'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser, getUsersByIds } = require('../../../dao/users/users');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('POST /users/new', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .post('/api/users/new')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .post('/api/users/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('creates a new user and responds with 201 and the user id if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const newUserData = generateRandomUser({ email: 'b@gmail.com' });

    const response = await request(app.listen())
      .post('/api/users/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: newUserData })
      .expect(201);

    const newId = response.body.id;

    const [savedUser] = await getUsersByIds([newId]);

    expect(savedUser).toEqual({ id: newId, ...newUserData });
  });

  it('responds with 409 if a user with the given email address already exists', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'unicorn@gmail.com' });
    const id = await createUser(userData);

    const newUserData = generateRandomUser({ email: 'unicorn@gmail.com' });

    await request(app.listen())
      .post('/api/users/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: newUserData })
      .expect(409);
  });
});
