'use strict';

const firestore = require('../firestore');

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
  const allUsersRef = await firestore.collection('users');

  const properties = Object.entries(userData);

  const filteredUsersRef = await properties.reduce(async (lastRef, [propKey, propValue]) => {
    const newRef = (await lastRef).where(propKey, '==', propValue);
    return newRef;
  }, allUsersRef);

  const usersWithProps = await filteredUsersRef.get();
  const users = [];

  usersWithProps.forEach(document => {
    users.push({ 
      id: document.id,
      ...(document.data())
    });
  });

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
