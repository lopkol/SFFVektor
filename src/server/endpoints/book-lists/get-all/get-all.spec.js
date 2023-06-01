'use strict';

const request = require('supertest');
const app = require('../../../app');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const {
  generateRandomUser,
  generateRandomBookList
} = require('../../../../../test-helpers/generate-data');

describe('GET /book-lists', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('bookLists')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/book-lists').expect(401);
  });

  it('returns with 200 with the book lists', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const userId = await createUser(userData);

    const bookListData1 = await generateRandomBookList({ year: '2020', genre: 'fantasy' });
    const bookListData2 = await generateRandomBookList({ year: '2020', genre: 'scifi' });
    const bookListData3 = await generateRandomBookList({ year: '2019', genre: 'scifi' });
    const bookListId1 = await createBookList(bookListData1);
    const bookListId2 = await createBookList(bookListData2);
    const bookListId3 = await createBookList(bookListData3);

    const response = await request(app.listen())
      .get('/api/book-lists')
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'user' })])
      .expect(200);

    const expectedData = {
      bookLists: jasmine.arrayWithExactContents([
        { id: bookListId1, ...bookListData1 },
        { id: bookListId2, ...bookListData2 },
        { id: bookListId3, ...bookListData3 }
      ])
    };

    expect(response.body).toEqual(expectedData);
  });
});
