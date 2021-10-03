'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookList, generateRandomReadingPlan } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createBookList } = require('../../../dao/book-lists/book-lists');
const { createReadingPlans } = require('../../../dao/reading-plans/reading-plans');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('GET /reading-plans/all/:bookListId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists'),
      clearCollection('readingPlans')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .get('/api/reading-plans/all/something')
      .expect(401);
  });

  it('responds with 404 if the book list does not exist', async () =>{
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);
    const noId = 'badId';

    await request(app.listen())
      .get(`/api/reading-plans/all/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(404);
  });

  it('responds with 200 and the reading plans', async () => {
    const userData1 = generateRandomUser({ role: 'user' });
    const userId1 = await createUser(userData1);
    const userData2 = generateRandomUser();
    const userId2 = await createUser(userData2);

    const readingPlanData1 = generateRandomReadingPlan({ userId: userId1 });
    const readingPlanData2 = generateRandomReadingPlan({ userId: userId1 });
    const readingPlanData3 = generateRandomReadingPlan({ userId: userId1 });
    const readingPlanData4 = generateRandomReadingPlan({ userId: userId2, bookId: readingPlanData1.bookId });
    const readingPlanData5 = generateRandomReadingPlan({ userId: userId2, bookId: readingPlanData2.bookId });
    const readingPlanData6 = generateRandomReadingPlan({ userId: userId2, bookId: readingPlanData3.bookId });

    await createReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3, readingPlanData4, readingPlanData5, readingPlanData6]);

    const bookListData = generateRandomBookList({ juryIds: [userId1, userId2], bookIds: [readingPlanData1.bookId, readingPlanData2.bookId, readingPlanData3.bookId] });
    const bookListId = await createBookList(bookListData);

    const response = await request(app.listen())
      .get(`/api/reading-plans/all/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ userId1, role: 'user' })])
      .expect(200);

    expect(response.body.readingPlansByBook).toEqual(jasmine.arrayWithExactContents([
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData1),
        jasmine.objectContaining(readingPlanData4)
      ]),
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData2),
        jasmine.objectContaining(readingPlanData5)
      ]),
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData3),
        jasmine.objectContaining(readingPlanData6)
      ])
    ]));
  });

  it('creates the missing reading plans with noPlan status', async () => {
    const userData1 = generateRandomUser({ role: 'user' });
    const userId1 = await createUser(userData1);
    const userData2 = generateRandomUser();
    const userId2 = await createUser(userData2);

    const bookId1 = '12345';
    const bookId2 = '67890';
    const bookId3 = '76543';

    const readingPlanData1 = generateRandomReadingPlan({ userId: userId1, bookId: bookId1 });
    const readingPlanData2 = generateRandomReadingPlan({ userId: userId1, bookId: bookId3 });
    const readingPlanData3 = generateRandomReadingPlan({ userId: userId2, bookId: bookId2 });
    const readingPlanData4 = generateRandomReadingPlan({ userId: userId2, bookId: bookId3 });

    await createReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3, readingPlanData4]);

    const bookListData = generateRandomBookList({ juryIds: [userId1, userId2], bookIds: [bookId1, bookId2, bookId3] });
    const bookListId = await createBookList(bookListData);

    const response = await request(app.listen())
      .get(`/api/reading-plans/all/${bookListId}`)
      .set('Cookie', [createAuthorizationCookie({ userId1, role: 'user' })])
      .expect(200);

    const expectedReadingPlans = [
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData1),
        jasmine.objectContaining({
          userId: userId2,
          bookId: bookId1,
          status: 'noPlan'
        })
      ]),
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData3),
        jasmine.objectContaining({
          userId: userId1,
          bookId: bookId2,
          status: 'noPlan'
        })
      ]),
      jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData2),
        jasmine.objectContaining(readingPlanData4)
      ])
    ];
    
    expect(response.body.readingPlansByBook).toEqual(jasmine.arrayWithExactContents(expectedReadingPlans));
  });
});
