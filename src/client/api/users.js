'use strict';

const axios = require('axios');

async function getUsers() {
  try {
    const response = await axios.get('/api/users');
    return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  
    throw error;
  }
}

module.exports = {
  getUsers
};
