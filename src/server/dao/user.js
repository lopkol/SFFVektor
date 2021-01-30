'use strict';

const firestore = require('./firestore');

async function createUser(userData) {
  const user = await firestore.collection('users').add(userData);
  return user.id;
}

async function getUserById(userId) {
  const userRef = await firestore.collection('users').doc(userId);
  const document = await userRef.get();
  if (!document.exists) {
    return null;
  }
  return document.data();
}

async function getUsers() {
  const result = await firestore.collection('users').get();
  const users = [];
  result.forEach(document => users.push(document.data()));

  return users;
}

module.exports = {
  createUser,
  getUserById,
  getUsers
};
