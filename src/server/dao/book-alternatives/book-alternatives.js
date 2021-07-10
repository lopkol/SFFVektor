'use strict';

const firestore = require('../firestore');
const { pick } = require('lodash');
const { constructQuery, mapToDataWithId } = require('../helper-functions');

const bookAlternativeProperties = [
  'name',
  'urls' //array
];

async function createBookAlternative(alternativeData) {
  const alternativeDataToSave = pick(alternativeData, bookAlternativeProperties);
  const bookAlternative = await firestore.collection('bookAlternatives').add(alternativeDataToSave);
  return bookAlternative.id;
}

async function updateBookAlternative(id, alternativeData) {
  const alternativeDataToSave = pick(alternativeData, bookAlternativeProperties);
  try {
    const alternativeRef = firestore.collection('bookAlternatives').doc(id);
    await alternativeRef.update(alternativeDataToSave);
  } catch (error) {
    return null;
  }

  const alternative = await firestore.collection('bookAlternatives').doc(id).get();
  return { id, ...(alternative.data()) };
}

async function deleteBookAlternative(id) {
  const alternativeRef = firestore.collection('bookAlternatives').doc(id);
  const alternative = await alternativeRef.get();
  if (!alternative.exists) {
    return null;
  }
  await alternativeRef.delete();

  return { id, ...alternative.data() };
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

async function getBookAlternativeWithUrl(url) {
  const bookAlternatives = await firestore.collection('bookAlternatives').where('urls', 'array-contains', url).get();
  if (bookAlternatives.size === 0) {
    return null;
  }

  const [alternative] = mapToDataWithId(bookAlternatives);

  return alternative;
}

async function getBookAlternativesWithProps(alternativeData = {}) {
  const bookDataToQuery = pick(alternativeData, bookAlternativeProperties);
  const filteredBookAlternativesRef = await constructQuery('bookAlternatives', bookDataToQuery);

  const alternativesWithProps = await filteredBookAlternativesRef.get();
  const alternatives = mapToDataWithId(alternativesWithProps);

  return alternatives;
}

module.exports = {
  createBookAlternative,
  updateBookAlternative,
  deleteBookAlternative,
  getBookAlternativesByIds,
  getBookAlternativeWithUrl,
  getBookAlternativesWithProps
};
