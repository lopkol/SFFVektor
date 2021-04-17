'use strict';

const { api } = require('../api');

//TODO: errorhandling

async function getOwnData() {
  const response = await api.get('/api/user');
  return response.data.userData;
}

async function getUsers() {
  const response = await api.get('/api/users');
  return response.data.userList;
}

async function getUser(userId) {
  const response = await api.get(`/api/users/${userId}`);
  return response.data.userData;
}

async function saveUser(userData) {
  const response = await api.post('/api/users/new', { userData });
  return response.data.id;
}

async function updateUser(userId, userData) {
  await api.patch(`/api/users/${userId}`, { userData });
}

module.exports = {
  getOwnData,
  getUsers,
  getUser,
  saveUser,
  updateUser
};
