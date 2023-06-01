'use strict';

const { pick } = require('lodash');
const firestore = require('../firestore');
const { constructQuery, mapToDataWithId } = require('../helper-functions');

const authorProperties = ['name', 'sortName', 'isApproved'];

async function createAuthor(authorData) {
  const authorDataToSave = pick(authorData, authorProperties);
  const author = await firestore.collection('authors').add(authorDataToSave);
  return author.id;
}

async function updateAuthor(id, authorData) {
  const authorDataToSave = pick(authorData, authorProperties);
  try {
    const authorRef = firestore.collection('authors').doc(id);
    await authorRef.update(authorDataToSave);
  } catch (error) {
    return null;
  }

  const author = await firestore.collection('authors').doc(id).get();
  return { id, ...author.data() };
}

async function getAuthorById(id) {
  const author = await firestore.collection('authors').doc(id).get();
  if (!author.exists) {
    return null;
  }
  return { id, ...author.data() };
}

async function getAuthorsWithProps(authorData = {}) {
  const authorDataToQuery = pick(authorData, authorProperties);
  const filteredAuthorsRef = await constructQuery('authors', authorDataToQuery);

  const authorsWithProps = await filteredAuthorsRef.get();
  const authors = mapToDataWithId(authorsWithProps);

  return authors;
}

module.exports = {
  createAuthor,
  updateAuthor,
  getAuthorById,
  getAuthorsWithProps
};
