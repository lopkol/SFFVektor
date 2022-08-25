'use strict';

const { createReadingPlans, setReadingPlans, updateReadingPlans, getReadingPlansWithProps } = require('./reading-plans');
const { clearCollection } = require('../../../../test-helpers/firestore');
const { generateRandomReadingPlan } = require('../../../../test-helpers/generate-data');
const { v4: uuidv4 } = require('uuid');

describe('reading plans DAO', () => {
  beforeEach(async () => {
    await clearCollection('readingPlans');
  });

  describe('createReadingPlans', () => {
    it('creates reading plans with the given properties, returns the ids', async () => {
      const readingPlanData1 = generateRandomReadingPlan();
      const readingPlanData2 = generateRandomReadingPlan();
      const [id1, id2] = await createReadingPlans([readingPlanData1, readingPlanData2]);

      const readingPlansInDb = await getReadingPlansWithProps();
      expect(readingPlansInDb).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...readingPlanData1 },
        { id: id2, ...readingPlanData2 }
      ]));
    });

    it('returns null if a reading plan for the same user and book already exists', async () => {
      const userId = uuidv4();
      const bookId = uuidv4();
      const readingPlanData = generateRandomReadingPlan({ userId, bookId });
      const otherReadingPlanData = generateRandomReadingPlan({ userId, bookId });

      await createReadingPlans([readingPlanData]);
      const res = await createReadingPlans([otherReadingPlanData]);

      expect(res).toEqual([null]);
    });
  });

  describe('setReadingPlans', () => {
    it('creates reading plans with the given properties if they do not exist', async () => {
      const readingPlanData1 = generateRandomReadingPlan();
      const readingPlanData2 = generateRandomReadingPlan();

      await setReadingPlans([readingPlanData1, readingPlanData2]);
      const booksInDb = await getReadingPlansWithProps();

      expect(booksInDb).toEqual(jasmine.arrayWithExactContents([
        jasmine.objectContaining(readingPlanData1),
        jasmine.objectContaining(readingPlanData2)
      ]));
    });

    it('updates the correct reading plans and only the given properties', async () => {
      const readingPlanData1 = generateRandomReadingPlan();
      const readingPlanData2 = generateRandomReadingPlan();
      const readingPlanData3 = generateRandomReadingPlan();

      await setReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3]);

      const newReadingPlanData1 = {
        userId: readingPlanData1.userId,
        bookId: readingPlanData1.bookId,
        status: 'new status 1'
      };
      const newReadingPlanData2 = {
        userId: readingPlanData2.userId,
        bookId: readingPlanData2.bookId,
        status: 'new status 2'
      };
      await setReadingPlans([newReadingPlanData1, newReadingPlanData2]);

      const res = await getReadingPlansWithProps();

      expect(res).toEqual(jasmine.arrayWithExactContents([
        jasmine.objectContaining({ ...readingPlanData1, ...newReadingPlanData1 }),
        jasmine.objectContaining({ ...readingPlanData2, ...newReadingPlanData2 }),
        jasmine.objectContaining(readingPlanData3)
      ]));
    });
  });

  describe('updateReadingPlans', () => {
    it('returns null if the reading plan does not exist', async () => {
      const readingPlanData = generateRandomReadingPlan();
      const res = await updateReadingPlans([readingPlanData]);

      expect(res).toEqual([null]);
    });

    it('retruns the correctly updated properties', async () => {
      const readingPlanData = generateRandomReadingPlan();
      const userId = readingPlanData.userId;
      const bookId = readingPlanData.bookId;
      const [id] = await createReadingPlans([readingPlanData]);

      const readingPlanDataToUpdate = { userId, bookId, status: 'kocka' };
      const res = await updateReadingPlans([readingPlanDataToUpdate]);

      expect(res).toEqual([{ id, ...readingPlanData, ...readingPlanDataToUpdate }]);
    });

    it('correctly updates the given reading plans, does not change the others', async () => {
      const readingPlanData1 = generateRandomReadingPlan();
      const readingPlanData2 = generateRandomReadingPlan();
      const readingPlanData3 = generateRandomReadingPlan();
      const [id1, id2, id3] = await createReadingPlans([readingPlanData1, readingPlanData2, readingPlanData3]);

      const newReadingPlanData1 = {
        userId: readingPlanData1.userId,
        bookId: readingPlanData1.bookId,
        status: 'new status 1'
      };
      const newReadingPlanData2 = {
        userId: readingPlanData2.userId,
        bookId: readingPlanData2.bookId,
        status: 'new status 2'
      };

      await updateReadingPlans([newReadingPlanData1, newReadingPlanData2]);

      const res = await getReadingPlansWithProps();

      expect(res).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...readingPlanData1, ...newReadingPlanData1 },
        { id: id2, ...readingPlanData2, ...newReadingPlanData2 },
        { id: id3, ...readingPlanData3 }
      ]));
    });
  });

  describe('getReadingPlansWithProps', () => {
    it('returns an empty array if there is no reading plan with the given properties', async () => {
      const readingPlanData1 = generateRandomReadingPlan();
      const readingPlanData2 = generateRandomReadingPlan();
      await createReadingPlans([readingPlanData1, readingPlanData2]);

      const status = 'nonexistent status';
      const readingPlansWithProps = await getReadingPlansWithProps({ status });

      expect(readingPlansWithProps).toEqual([]);
    });

    it('returns all reading plans if called with empty arg', async () => {
      const readingPlanData1 = generateRandomReadingPlan();
      const readingPlanData2 = generateRandomReadingPlan();
      const [id1, id2] = await createReadingPlans([readingPlanData1, readingPlanData2]);

      const readingPlansWithProps = await getReadingPlansWithProps();

      expect(readingPlansWithProps).toEqual(jasmine.arrayWithExactContents([
        { id: id1, ...readingPlanData1 },
        { id: id2, ...readingPlanData2 }
      ]));
    });

    it('returns the reading plans with the given properties', async () => {
      const readingPlanData1 = generateRandomReadingPlan({ userId: '1' });
      const readingPlanData2 = generateRandomReadingPlan({ userId: '2' });
      const [id] = await createReadingPlans([readingPlanData1, readingPlanData2]);

      const userId = '1';
      const readingPlansWithProps = await getReadingPlansWithProps({ userId });

      expect(readingPlansWithProps).toEqual([{ id, ...readingPlanData1 }]);
    });
  });
});
