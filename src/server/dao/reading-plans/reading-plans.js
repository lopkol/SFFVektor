'use strict';

const { pick } = require('lodash');
const firestore = require('../firestore');
const { constructQuery, mapToDataWithId } = require('../helper-functions');

const readingPlanProperties = ['userId', 'bookId', 'status']; //only status can be modified

async function createReadingPlans(readingPlansData) {
  try {
    const readingPlanIds = readingPlansData.map(readingPlanData => readingPlanData.userId + readingPlanData.bookId);
    await firestore.runTransaction(async transaction => { 
      const readingPlans = await Promise.all(readingPlansData.map(async readingPlanData => {

        const id = readingPlanData.userId + readingPlanData.bookId;
        const readingPlanRef = firestore.collection('readingPlans').doc(id);
        const readingPlanSnapshot = await transaction.get(readingPlanRef); 

        return { id, ref: readingPlanRef, snapshot: readingPlanSnapshot };
      }));

      readingPlans.map((readingPlan, index) => {
        if (readingPlan.snapshot.exists) {
          readingPlanIds[index] = null;
        } else {
          transaction.set(readingPlan.ref, readingPlansData[index]);
        }
      });
    });

    return readingPlanIds;
  } catch (error) {
    throw new Error('Unsuccesful data update');
  }
}

async function updateReadingPlans(readingPlansData) {
  let readingPlanIds;
  try {
    readingPlanIds = readingPlansData.map(readingPlanData => readingPlanData.userId + readingPlanData.bookId);
    await firestore.runTransaction(async transaction => { 
      const readingPlans = await Promise.all(readingPlansData.map(async readingPlanData => {

        const id = readingPlanData.userId + readingPlanData.bookId;
        const readingPlanRef = firestore.collection('readingPlans').doc(id);
        const readingPlanSnapshot = await transaction.get(readingPlanRef); 

        return { id, ref: readingPlanRef, snapshot: readingPlanSnapshot };
      }));

      readingPlans.map((readingPlan, index) => {
        if (!readingPlan.snapshot.exists) {
          readingPlanIds[index] = null;
        } else {
          transaction.update(readingPlan.ref, readingPlansData[index]);
        }
      });
    });
  } catch (error) {
    throw new Error('Unsuccesful data update');
  }

  const updatedReadingPlansData = await Promise.all(readingPlanIds.map(async id => {
    if (id === null) {
      return null;
    } 
    const readingPlan = await firestore.collection('readingPlans').doc(id).get();
    return {
      id: readingPlan.id,
      ...readingPlan.data()
    };
  }));

  return updatedReadingPlansData;
}

async function getReadingPlansWithProps(readingPlanData) {
  const readingPlanDataToQuery = pick(readingPlanData, readingPlanProperties);
  const filteredReadingPlansRef = await constructQuery('readingPlans', readingPlanDataToQuery);

  const readingPlansWithProps = await filteredReadingPlansRef.get();
  const readingPlans = mapToDataWithId(readingPlansWithProps);

  return readingPlans;
}

module.exports = {
  createReadingPlans,
  updateReadingPlans,
  getReadingPlansWithProps
};
