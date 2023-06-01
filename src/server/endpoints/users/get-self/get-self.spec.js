'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookList } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('GET /user', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('bookLists')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/user').expect(401);
  });

  it('responds with 404 if a user with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const noId = id + '1234';

    await request(app.listen())
      .get('/api/user')
      .set('Cookie', [createAuthorizationCookie({ id: noId, role: 'admin' })])
      .expect(404);
  });

  it('returns with 200 with the user data', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookListData1 = generateRandomBookList({ year: 2020, juryIds: [id] });
    const bookListData2 = generateRandomBookList({ year: 2019, juryIds: [id] });
    const bookListId1 = await createBookList(bookListData1);
    const bookListId2 = await createBookList(bookListData2);

    const response = await request(app.listen())
      .get('/api/user')
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
