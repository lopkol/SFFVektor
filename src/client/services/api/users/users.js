'use strict';

const { api } = require('../api');

//TODO: errorhandling

async function getUsers() {
  const response = await api.get('/api/users');
  return response.data.userList;
}

async function getUser(userId) {
  const response = await api.get(`/api/users/${userId}`);
  return response.data.userData;
}

async function saveUser(userData) {
  await api.post('/api/users/new', { userData });
}

async function updateUser(userId, userData) {
  await api.patch(`/api/users/${userId}`, { userData });
}

module.exports = {
  getUsers,
  getUser,
  saveUser,
  updateUser
};
