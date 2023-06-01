'use strict';

const firestore = require('./firestore');

async function constructQuery(collectionName, properties) {
  const allStuffRef = firestore.collection(collectionName);

  const props = Object.entries(properties);

  const query = await props.reduce(async (lastQuery, [propKey, propValue]) => {
    const newQuery = (await lastQuery).where(propKey, '==', propValue);
    return newQuery;
  }, allStuffRef);

  return query;
}

function mapToDataWithId(querySnapshot) {
  const dataWithId = [];
  querySnapshot.forEach(async document => {
    dataWithId.push({
      id: document.id,
      ...document.data()
    });
  });

  return dataWithId;
}

module.exports = {
  constructQuery,
  mapToDataWithId
};
