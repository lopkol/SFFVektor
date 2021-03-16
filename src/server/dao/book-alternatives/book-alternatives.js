'use strict';

const firestore = require('../firestore');
const { pick } = require('lodash');
const { constructQuery, mapToDataWithId } = require('../helper-functions');

const bookAlternativeProperties = [
  'name',
  'urls' //array
];

async function createBookAlternatives(alternativesData) {
  const alternativeIds = await Promise.all(alternativesData.map(async alternativeData => {
    const alternativeDataToSave = pick(alternativeData, bookAlternativeProperties);
    const bookAlternative = await firestore.collection('bookAlternatives').add(alternativeDataToSave);
    return bookAlternative.id;
  }));
  return alternativeIds;
}

async function updateBookAlternatives(alternativesData) {
  let alternativeIds;
  try {
    alternativeIds = alternativesData.map(alternative => alternative.id);
    await firestore.runTransaction(async transaction => { 
      const alternatives = await Promise.all(alternativesData.map(async alternativeData => {

        const alternativeRef = firestore.collection('bookAlternatives').doc(alternativeData.id);
        const alternativeSnapshot = await transaction.get(alternativeRef); 

        return { id: alternativeData.id, ref: alternativeRef, snapshot: alternativeSnapshot };
      }));

      alternatives.map((alternative, index) => {
        if (!alternative.snapshot.exists) {
          alternativeIds[index] = null;
        } else {
          transaction.update(alternative.ref, alternativesData[index]);
        }
      });
    });
  } catch (error) {
    throw new Error('Unsuccesful data update');
  }

  const updatedBookAlternatives = await Promise.all(alternativeIds.map(async id => {
    if (id === null) {
      return null;
    } 
    const alternative = await firestore.collection('bookAlternatives').doc(id).get();
    return {
      id: alternative.id,
      ...alternative.data()
    };
  }));

  return updatedBookAlternatives;
}

async function getBookAlternativesByIds(alternativeIds) {
  const alternatives = await Promise.all(alternativeIds.map(async id => {
    const alternative = await firestore.collection('bookAlternatives').doc(id).get();
    if (!alternative.exists) {
      return null;
    }
    return { id, ...(alternative.data()) };
  }));

  return alternatives;
}

async function getBookAlternativesWithProps(alternativeData = {}) {
  const bookDataToQuery = pick(alternativeData, bookAlternativeProperties);
  const filteredBookAlternativesRef = await constructQuery('bookAlternatives', bookDataToQuery);

  const alternativesWithProps = await filteredBookAlternativesRef.get();
  const alternatives = mapToDataWithId(alternativesWithProps);

  return alternatives;
}

module.exports = {
  createBookAlternatives,
  updateBookAlternatives,
  getBookAlternativesByIds,
  getBookAlternativesWithProps
};
