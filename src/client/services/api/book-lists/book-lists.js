'use strict';

const { api } = require('../api');

//TODO: error handling

async function getBookList({ year, genre }) {
  const response = await api.get(`/api/book-lists/${year}/${genre}`);
  return response.data;
}

async function getBookLists() {
  const response = await api.get('/api/book-lists');
  return response.data.bookLists;
}

module.exports = {
  getBookList,
  getBookLists
};
