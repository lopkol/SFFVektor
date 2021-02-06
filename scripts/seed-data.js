'use strict';

const { v4: uuidv4 } = require('uuid');
const { generateRandomUser } = require('./generate-data');
const firestore = require('../src/server/dao/firestore');
const { allowedUsers } = require('../src/server/config');
const { clearCollection } = require('../test-helpers/firestore');

const batch = firestore.batch();

async function addUserToBatch(props) {
  const userId = uuidv4();
  const newUserRef = await firestore.collection('users').doc(userId);
  await batch.set(newUserRef, generateRandomUser(props));
}

async function addUsersWithRole(role, count) {
  await Promise.all(
    Array(count).fill(null).map(
      () => addUserToBatch({ role })
    )
  );
}

(async () => {
  await clearCollection('users');

  await Promise.all([
    addUsersWithRole('admin', 3),
    addUsersWithRole('user', 7),
    ...allowedUsers.map(
      email => addUserToBatch({ email, role: 'admin' })
    )
  ]);

  await batch.commit();
})();
