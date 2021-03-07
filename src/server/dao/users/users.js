'use strict';

const firestore = require('../firestore');
const { createFilteredRef, mapToDataWithId } = require('../helper-functions');

async function createUser(userData) {
  const user = await firestore.collection('users').add(userData);
  return user.id;
}

async function getUserById(id) {
  const user = await firestore.collection('users').doc(id).get();
  if (!user.exists) {
    return null;
  }
  return { id, ...(user.data()) };
}

async function getUsersWithProps(userData = {}) {
  const filteredUsersRef = await createFilteredRef('users', userData);

  const usersWithProps = await filteredUsersRef.get();
  const users = mapToDataWithId(usersWithProps);

  return users;
}

async function updateUser(id, userData) {
  let user = await firestore.collection('users').doc(id).get();
  if (!user.exists) {
    return null;
  }

  const userRef = firestore.collection('users').doc(id);
  await userRef.set(userData, { merge: true });

  user = await userRef.get();
  return { id, ...(user.data()) };
}

module.exports = {
  createUser,
  getUserById,
  getUsersWithProps,
  updateUser
};
