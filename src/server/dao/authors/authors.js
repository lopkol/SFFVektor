'use strict';

const { omit } = require('lodash');
const firestore = require('../firestore');
const { createFilteredRef, mapToDataWithId } = require('../helper-functions');

async function updateAuthor(authorData) {
  const id = authorData.id;
  const authorRef = firestore.collection('authors').doc(id);

  await authorRef.set(omit(authorData, 'id'), { merge: true });

  const updatedAuthor = await authorRef.get();
  return { id, ...(updatedAuthor.data()) };
}

async function getAuthorById(id) {
  const author = await firestore.collection('authors').doc(id).get();
  if (!author.exists) {
    return null;
  }
  return { id, ...(author.data()) };
}

async function getAuthorsWithProps(authorData = {}) {
  const filteredAuthorsRef = await createFilteredRef('authors', authorData);

  const authorsWithProps = await filteredAuthorsRef.get();
  const authors = mapToDataWithId(authorsWithProps);

  return authors;
}

module.exports = {
  updateAuthor,
  getAuthorById,
  getAuthorsWithProps
};
