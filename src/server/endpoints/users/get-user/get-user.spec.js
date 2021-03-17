'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookList } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('GET /users/:userId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .get('/api/users/something')
      .expect(401);
  });

  it('responds with 403 if the user is not admin and trying to get the details of someone else', async () => {
    const userData = generateRandomUser({ role: 'user', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const otherUserData = generateRandomUser({ email: 'b@gmail.com' });
    const otherId = await createUser(otherUserData);

    await request(app.listen())
      .get(`/api/users/${otherId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('responds with 404 if a user with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const noId = id + '1234';

    await request(app.listen())
      .get(`/api/users/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(404);
  });

  it('returns with 200 with the user data if the user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const otherUserData = generateRandomUser({ email: 'b@gmail.com' });
    const otherId = await createUser(otherUserData);

    const bookListData1 = generateRandomBookList({ year: 2020, juryIds: [otherId, id] });
    const bookListData2 = generateRandomBookList({ year: 2019, juryIds: [otherId] });
    const bookListId1 = await createBookList(bookListData1);
    const bookListId2 = await createBookList(bookListData2);

    const response = await request(app.listen())
      .get(`/api/users/${otherId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .expect(200);

    expect(response.body.userData).toEqual({ 
      id: otherId, 
      ...otherUserData, 
      bookLists: jasmine.arrayWithExactContents([
        { id: bookListId1, ...bookListData1 },
        { id: bookListId2, ...bookListData2 }
      ]) 
    });
  });

  it('returns with 200 with the user data if the user is trying to get his own details', async () => {
    const userData = generateRandomUser({ role: 'user', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const bookListData1 = generateRandomBookList({ year: 2020, juryIds: [id] });
    const bookListData2 = generateRandomBookList({ year: 2019, juryIds: [id] });
    const bookListId1 = await createBookList(bookListData1);
    const bookListId2 = await createBookList(bookListData2);

    const response = await request(app.listen())
      .get(`/api/users/${id}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(200);

    expect(response.body.userData).toEqual({ 
      id, 
      ...userData, 
      bookLists: jasmine.arrayWithExactContents([
        { id: bookListId1, ...bookListData1 },
        { id: bookListId2, ...bookListData2 }
      ]) 
    });
  });
});
