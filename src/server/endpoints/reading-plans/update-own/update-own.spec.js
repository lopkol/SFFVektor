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

describe('PUT /reading-plans/own/:bookListId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists'),
      clearCollection('readingPlans')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).put('/api/reading-plans/own/something').expect(401);
  });

  it('responds with 404 if the book list does not exist', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);
    const noId = 'badId';

    await request(app.listen())
      .put(`/api/reading-plans/own/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(404);
  });

  it('responds with 403 if the user is not a jury member of the book list', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookListData = generateRandomBookList({ juryIds: [] });
    const bookListId = await createBookList(bookListData);

    await request(app.listen())
      .put(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('responds with 400 if readingPlans is not an array', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookListData = generateRandomBookList({ juryIds: [id] });
    const bookListId = await createBookList(bookListData);

    const readingPlanData = generateRandomReadingPlan({ userId: id });

    await request(app.listen())
      .put(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ readingPlans: readingPlanData })
      .expect(400);
  });

  it('responds with 403 if the user is trying to update a reading plan of someone else', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const bookListData = generateRandomBookList({ juryIds: [id] });
    const bookListId = await createBookList(bookListData);

    const readingPlanData1 = generateRandomReadingPlan({ userId: id });
    const readingPlanData2 = generateRandomReadingPlan();

    await request(app.listen())
      .put(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ readingPlans: [readingPlanData1, readingPlanData2] })
      .expect(403);
  });

  it('responds with 200 and updates the reading plans', async () => {
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

    const readingPlanUpdate1 = generateRandomReadingPlan({
      userId: id,
      bookId: readingPlanData1.bookId
    });
    const readingPlanUpdate3 = generateRandomReadingPlan({
      userId: id,
      bookId: readingPlanData3.bookId
    });

    await request(app.listen())
      .put(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ readingPlans: [readingPlanUpdate1, readingPlanUpdate3] })
      .expect(200);

    const readingPlansInDb = await getReadingPlansWithProps({ userId: id });

    expect(readingPlansInDb).toEqual(
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanUpdate1),
        jasmine.objectContaining(readingPlanData2),
        jasmine.objectContaining(readingPlanUpdate3)
      ])
    );
  });

  it('creates the missing reading plans', async () => {
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

    const readingPlanUpdate1 = generateRandomReadingPlan({
      userId: id,
      bookId: readingPlanData1.bookId
    });
    const newReadingPlan1 = generateRandomReadingPlan({ userId: id, bookId: bookId1 });
    const newReadingPlan2 = generateRandomReadingPlan({ userId: id, bookId: bookId2 });

    await request(app.listen())
      .put(`/api/reading-plans/own/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ readingPlans: [readingPlanUpdate1, newReadingPlan1, newReadingPlan2] })
      .expect(200);

    const readingPlansInDb = await getReadingPlansWithProps({ userId: id });
    expect(readingPlansInDb).toEqual(
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanUpdate1),
        jasmine.objectContaining(readingPlanData2),
        jasmine.objectContaining(readingPlanData3),
        jasmine.objectContaining(newReadingPlan1),
        jasmine.objectContaining(newReadingPlan2)
      ])
    );
  });
});
