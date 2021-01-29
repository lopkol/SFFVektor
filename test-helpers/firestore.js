'use strict';

const firestore = require('../src/server/dao/firestore');

async function clearCollection(collectionName) {
  const snapshot = await firestore.collection(collectionName).get();
  await Promise.all(
    snapshot.docs.map(
      async document => await document.ref.delete()
    )
  );
}

module.exports = {
  clearCollection
};
