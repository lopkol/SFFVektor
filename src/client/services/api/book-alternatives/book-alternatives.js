'use strict';

const { api } = require('../api');

//TODO: error handling

async function getBookAlternative(bookAlternativeId) {
  const response = await api.get(`/api/book-alternatives/${bookAlternativeId}`);
  return response.data.bookAlternativeData;
}

async function updateBookAlternative(bookAlternativeId, bookAlternativeData) {
  const response = await api.patch(`/api/book-alternatives/${bookAlternativeId}`, {
    bookAlternativeData
  });
  return response.data.bookAlternativeData;
}

async function saveBookAlternative(bookAlternativeData) {
  const response = await api.post('/api/book-alternatives/new', { bookAlternativeData });
  return response.data.id;
}

module.exports = {
  getBookAlternative,
  updateBookAlternative,
  saveBookAlternative
};
