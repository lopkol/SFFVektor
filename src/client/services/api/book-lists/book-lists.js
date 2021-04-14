'use strict';

const { api } = require('../api');

//TODO: error handling

async function getBookList(bookListId) {
  const response = await api.get(`/api/book-lists/${bookListId}`);
  return response.data;
}

async function getBookLists() {
  const response = await api.get('/api/book-lists');
  return response.data.bookLists;
}

async function updateBookList(bookListId, bookListData) {
  const response = await api.patch(`/api/book-lists/${bookListId}`, { bookListData });
  return response.data.bookList;
}

async function saveBookList(bookListData) {
  const response = await api.post('/api/book-lists/new', { bookListData });
  return response.data.id;
}

async function updateBookListFromMoly(bookListId) {
  await api.post(`/api/book-lists/${bookListId}/moly-update`);
}

module.exports = {
  getBookList,
  getBookLists,
  updateBookList,
  saveBookList,
  updateBookListFromMoly
};
