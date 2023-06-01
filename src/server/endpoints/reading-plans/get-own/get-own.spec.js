'use strict';

const request = require('supertest');
const app = require('../../../app');
const {
  generateRandomUser,
  generateRandomBookList,
  generateRandomReadingPlan
} = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const {
  createReadingPlans,
  getReadingPlansWithProps
} = require('../../../dao/reading-plans/reading-plans');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('GET /reading-plans/own/:bookListId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists'),
      clearCollection('readingPlans')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).get('/api/reading-plans/own/something').expect(401);
  });

  it('responds with 404 if the book list does not exist', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);
    const noId = 'badId';

    await request(app.listen())
      .get(`/api/reading-plans/own/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(404);
  });

  it('responds with 204 if the user is not a jury member of the book list', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookListData = generateRandomBookList({ juryIds: [] });
    const bookListId = await createBookList(bookListData);

    await request(app.listen())
      .get(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(204);
  });

  it('responds with 200 and the reading plans if the user is a jury member of the book list', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const readingPlanData1 = generateRandomReadingPlan({ userId: id });
    const readingPlanData2 = generateRandomReadingPlan({ userId: id });
    const readingPlanData3 = generateRandomReadingPlan({ userId: id });
    await createReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3]);

    const bookListData = generateRandomBookList({
      juryIds: [id],
      bookIds: [readingPlanData1.bookId, readingPlanData2.bookId, readingPlanData3.bookId]
    });
    const bookListId = await createBookList(bookListData);

    const response = await request(app.listen())
      .get(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(200);

    expect(response.body.readingPlans).toEqual(
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData1),
        jasmine.objectContaining(readingPlanData2),
        jasmine.objectContaining(readingPlanData3)
      ])
    );
  });

  it('creates the missing reading plans with noPlan status', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const readingPlanData1 = generateRandomReadingPlan({ userId: id });
    const readingPlanData2 = generateRandomReadingPlan({ userId: id });
    const readingPlanData3 = generateRandomReadingPlan({ userId: id });
    await createReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3]);

    const bookId1 = '12345';
    const bookId2 = '98765';

    const bookListData = generateRandomBookList({
      juryIds: [id],
      bookIds: [readingPlanData1.bookId, bookId1, readingPlanData3.bookId, bookId2]
    });
    const bookListId = await createBookList(bookListData);

    const response = await request(app.listen())
      .get(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(200);

    const expectedReadingPlans = [
      jasmine.objectContaining(readingPlanData1),
      jasmine.objectContaining(readingPlanData3),
      jasmine.objectContaining({
        userId: id,
        bookId: bookId1,
        status: 'noPlan'
      }),
      jasmine.objectContaining({
        userId: id,
        bookId: bookId2,
        status: 'noPlan'
      })
    ];

    expect(response.body.readingPlans).toEqual(
      jasmine.arrayWithExactContents(expectedReadingPlans)
    );

    const readingPlansInDb = await getReadingPlansWithProps({ userId: id });
    expect(readingPlansInDb).toEqual(
      jasmine.arrayWithExactContents([
        ...expectedReadingPlans,
        jasmine.objectContaining(readingPlanData2)
      ])
    );
  });
});
