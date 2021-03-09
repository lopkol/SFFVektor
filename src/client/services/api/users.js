'use strict';

const { api } = require('../api');

async function getUsers() {
  //TODO: errorhandling..
  const response = await api.get('/api/users');
  return response.data;
}

module.exports = {
  getUsers
};
