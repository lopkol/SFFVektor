'use strict';

const { api } = require('../api');

//TODO: error handling

async function getBooks(year) {
  const response = await api.get(`/api/books-from-year/${year}`);
  return response.data.books;
}

async function getBook(bookId) {
  const response = await api.get(`/api/books/${bookId}`);
  return response.data.bookData;
}

async function updateBook(bookId, bookData) {
  const response = await api.patch(`/api/books/${bookId}`, { bookData });
  return response.data.bookData;
}

module.exports = {
  getBooks,
  getBook,
  updateBook
};
