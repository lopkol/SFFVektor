'use strict';

const { pick } = require('lodash');
const firestore = require('../firestore');
const { createFilteredRef, mapToDataWithId } = require('../helper-functions');

const readingPlanProperties = ['userId', 'bookId', 'status']; //only status can be modified

async function createReadingPlans(readingPlansData) {
  const batch = firestore.batch();

  const readingPlanIds = await Promise.all(readingPlansData.map(async readingPlanData => {
    const id = readingPlanData.userId + readingPlanData.bookId;
    const newReadingPlanRef = await firestore.collection('readingPlans').doc(id);

    const readingPlan = await newReadingPlanRef.get();
    if (readingPlan.exists) {
      return null;
    }

    await batch.set(newReadingPlanRef, readingPlanData);
    return id;
  }));

  await batch.commit();
  return readingPlanIds;
}

async function updateReadingPlans(readingPlansData) {
  const batch = firestore.batch();

  const readingPlanIds = await Promise.all(readingPlansData.map(async readingPlanData => {
    const id = readingPlanData.userId + readingPlanData.bookId;
    const newReadingPlanRef = await firestore.collection('readingPlans').doc(id);

    const readingPlan = await newReadingPlanRef.get();
    if (!readingPlan.exists) {
      return null;
    }

    await batch.set(newReadingPlanRef, readingPlanData, { merge: true });
    return id;
  }));

  await batch.commit();

  const newReadingPlansData = await Promise.all(readingPlanIds.map(async id => {
    if (id === null) {
      return null;
    } 
    const readingPlan = await firestore.collection('readingPlans').doc(id).get();
    return {
      id: readingPlan.id,
      ...readingPlan.data()
    };
  }));

  return newReadingPlansData;
}

async function getReadingPlansWithProps(readingPlanData) {
  const readingPlanDataToQuery = pick(readingPlanData, readingPlanProperties);
  const filteredReadingPlansRef = await createFilteredRef('readingPlans', readingPlanDataToQuery);

  const readingPlansWithProps = await filteredReadingPlansRef.get();
  const readingPlans = mapToDataWithId(readingPlansWithProps);

  return readingPlans;
}

module.exports = {
  createReadingPlans,
  updateReadingPlans,
  getReadingPlansWithProps
};
