'use strict';

const { randomString, generateRandomUser } = require('./generate-data');
const firestore = require('../src/server/dao/firestore');

const batch = firestore.batch();

(async () => {
  for (let i = 0; i < 20; i++) {
    const userId = randomString(10);
    const newUserRef = await firestore.collection('users').doc(userId);
    if (i < 4) {
      await batch.set(newUserRef, generateRandomUser({ role: 'admin' }));
    } else {
      await batch.set(newUserRef, generateRandomUser({ role: 'user' }));
    }
  }

  await batch.commit();
})();
