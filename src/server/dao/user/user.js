'use strict';

const firestore = require('../firestore');

async function createUser(userData) {
  const user = await firestore.collection('users').add(userData);
  return user.id;
}

async function getUserById(userId) {
  const document = await firestore.collection('users').doc(userId).get();
  if (!document.exists) {
    return null;
  }
  return document.data();
}

async function getUsersWithProps(userData = {}) {
  const allUsers = await firestore.collection('users');

  const properties = Object.entries(userData);
  const filteredUsers = [allUsers];
  for (let i = 0; i < properties.length; i++) {
    const [propKey, propValue] = properties[i];
    const lastRef = filteredUsers[filteredUsers.length - 1];
    const newRef = await lastRef.where(propKey, '==', propValue);
    filteredUsers.push(newRef);
  }

  const filteredUsersRef = filteredUsers[filteredUsers.length - 1];
  const usersWithProps = await filteredUsersRef.get();
  const users = [];
  usersWithProps.forEach(document => users.push(document.data()));

  return users;
}

module.exports = {
  createUser,
  getUserById,
  getUsersWithProps
};
