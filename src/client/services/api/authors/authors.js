'use strict';

const { api } = require('../api');

//TODO: error handling

async function getAuthors() {
  const response = await api.get('/api/authors');
  return response.data.authors;
}

async function getAuthor(authorId) {
  const response = await api.get(`/api/authors/${authorId}`);
  return response.data.authorData;
}

async function updateAuthor(authorId, authorData) {
  const response = await api.patch(`/api/authors/${authorId}`, { authorData });
  return response.data.authorData;
}

async function saveAuthor(authorData) {
  const response = await api.post('/api/authors/new', { authorData });
  return response.data.id;
}

module.exports = {
  getAuthors,
  getAuthor,
  updateAuthor,
  saveAuthor
};
