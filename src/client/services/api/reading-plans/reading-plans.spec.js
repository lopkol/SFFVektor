'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { createReadingPlans, getReadingPlansWithProps } = require('../../../../server/dao/reading-plans/reading-plans');
const { createBookList } = require('../../../../server/dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomUser, generateRandomBookList, generateRandomReadingPlan } = require('../../../../../test-helpers/generate-data');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

const { getOwnReadingPlans, updateOwnReadingPlans } = require('./reading-plans');

describe('client-side reading plan related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists'),
      clearCollection('readingPlans')
    ]);
  });

  afterEach(async () => {
    logUserOut();
  });

  describe('getOwnReadingPlans', () => {
    it('returns null if the user is not a jury member of the book list', withServer(async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'user' });

      const bookListData = generateRandomBookList({ juryIds: [] });
      const bookListId = await createBookList(bookListData);

      const res = await getOwnReadingPlans(bookListId);

      expect(res).toBe(null);
    }));

    it('returns the reading plans of the user for the given book list', withServer(async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'user' });

      const readingPlanData1 = generateRandomReadingPlan({ userId });
      const readingPlanData2 = generateRandomReadingPlan({ userId });
      const readingPlanData3 = generateRandomReadingPlan({ userId });
      await createReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3]);

      const bookId1 = '12345';
      const bookId2 = '98765';

      const bookListData = generateRandomBookList({ juryIds: [userId], bookIds: [readingPlanData1.bookId, bookId1, readingPlanData3.bookId, bookId2] });
      const bookListId = await createBookList(bookListData);

      const res = await getOwnReadingPlans(bookListId);

      const expectedReadingPlans = [
        jasmine.objectContaining(readingPlanData1),
        jasmine.objectContaining(readingPlanData3),
        jasmine.objectContaining({
          userId,
          bookId: bookId1,
          status: 'noPlan'
        }),
        jasmine.objectContaining({
          userId,
          bookId: bookId2,
          status: 'noPlan'
        })
      ];

      expect(res).toEqual(jasmine.arrayWithExactContents(expectedReadingPlans));

      const readingPlansInDb = await getReadingPlansWithProps({ userId });
      expect(readingPlansInDb).toEqual(jasmine.arrayWithExactContents([
        ...expectedReadingPlans,
        jasmine.objectContaining(readingPlanData2)
      ]));
    }));
  });

  describe('updateOwnReadingPlans', () => {
    it('updates the reading plans of the user', withServer(async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const readingPlanData1 = generateRandomReadingPlan({ userId });
      const readingPlanData2 = generateRandomReadingPlan({ userId });
      const readingPlanData3 = generateRandomReadingPlan({ userId });
      await createReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3]);

      const bookId1 = '12345';
      const bookId2 = '98765';

      const bookListData = generateRandomBookList({ juryIds: [userId], bookIds: [readingPlanData1.bookId, bookId1, readingPlanData3.bookId, bookId2] });
      const bookListId = await createBookList(bookListData);

      const readingPlanUpdate1 = generateRandomReadingPlan({ userId, bookId: readingPlanData1.bookId });
      const newReadingPlan1 = generateRandomReadingPlan({ userId, bookId: bookId1 });
      const newReadingPlan2 = generateRandomReadingPlan({ userId, bookId: bookId2 });

      await updateOwnReadingPlans(bookListId, [readingPlanUpdate1, newReadingPlan2, newReadingPlan1]);

      const readingPlansInDb = await getReadingPlansWithProps({ userId });
      expect(readingPlansInDb).toEqual(jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanUpdate1),
        jasmine.objectContaining(readingPlanData2),
        jasmine.objectContaining(readingPlanData3),
        jasmine.objectContaining(newReadingPlan1),
        jasmine.objectContaining(newReadingPlan2)
      ]));
    }));
  });
});
