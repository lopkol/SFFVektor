'use strict';

const firestore = require('./firestore');

async function createUser(email, role, genres) {
  await firestore.collection('users').add({ email, role, genres });
}

async function getUserById(userId) {

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
