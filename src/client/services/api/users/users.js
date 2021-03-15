'use strict';

const { api } = require('../api');

async function getUsers() {
  //TODO: errorhandling..
  const response = await api.get('/api/users');
  return response.data;
}

async function createUser(userData) {
  await api.post('/api/users/new', { userData });
}

async function updateUser(userId, userData) {
  await api.patch(`/api/users/${userId}`, { userData });
}

module.exports = {
  getUsers,
  createUser,
  updateUser
};
