'use strict';

const firestore = require('./firestore');

async function createFilteredRef(collectionName, properties) {
  const allStuffRef = await firestore.collection(collectionName);

  const props = Object.entries(properties);

  const filteredStuffRef = await props.reduce(async (lastRef, [propKey, propValue]) => {
    const newRef = (await lastRef).where(propKey, '==', propValue);
    return newRef;
  }, allStuffRef);

  return filteredStuffRef;
}

function mapToDataWithId(querySnapshot) {
  const dataWithId = [];
  querySnapshot.forEach(async document => {
    dataWithId.push({
      id: document.id,
      ...(document.data())
    });
  });

  return dataWithId;
}

module.exports = {
  createFilteredRef,
  mapToDataWithId
};
