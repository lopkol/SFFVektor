'use strict';

const { Firestore } = require('@google-cloud/firestore');
const config = require('../config');

const firestore = new Firestore({
  credentials: config.firestore.credentials,
  projectId: config.firestore.projectId
});

async function createUser(email) {
  await firestore.collection('users').add({
    email
  });
}

async function getUsers() {
  const result = await firestore.collection('users').get();
  const users = [];
  result.forEach(document => users.push(document.data()));

  return users;
}

module.exports = {
  createUser,
  getUsers
};
