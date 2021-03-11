'use strict';

const { api } = require('../api');

async function getBookList({ year, genre }) {
  //TODO: error handling
  const response = await api.get(`/api/book-lists/${year}/${genre}`);
  return response.data;
}

module.exports = {
  getBookList
};
