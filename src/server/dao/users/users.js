'use strict';

const firestore = require('../firestore');

async function createUser(userData) {
  const user = await firestore.collection('users').add(userData);
  return user.id;
}

async function getUserById(userId) {
  const user = await firestore.collection('users').doc(userId).get();
  if (!user.exists) {
    return null;
  }
  return user.data();
}

async function getUsersWithProps(userData = {}) {
  const allUsersRef = await firestore.collection('users');

  const properties = Object.entries(userData);

  const filteredUsersRef = await properties.reduce(async (lastRef, [propKey, propValue]) => {
    const newRef = (await lastRef).where(propKey, '==', propValue);
    return newRef;
  }, allUsersRef);

  const usersWithProps = await filteredUsersRef.get();
  const users = [];
  usersWithProps.forEach(async document => {
    users.push((await document).data());
    users[users.length - 1].id = document.id;
  });

  return users;
}

async function updateUser(userId, userData) {
  const userRef = firestore.collection('users').doc(userId);

  await userRef.set(userData, { merge: true });
}

module.exports = {
  createUser,
  getUserById,
  getUsersWithProps,
  updateUser
};
