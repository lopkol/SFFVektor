'use strict';

const firestore = require('../firestore');
const { omit } = require('lodash');
const { mapToDataWithId, createFilteredRef } = require('../helper-functions');

async function createBook(bookData) { //no id given! (for books with no moly id)
  const book = await firestore.collection('books').add(bookData);
  return book.id;
} 

async function updateBooks(booksData) {
  const batch = firestore.batch();

  booksData.forEach(bookData => {
    const id = bookData.id;
    const bookDataWithoutId = omit(bookData, 'id');
    const bookRef = firestore.collection('books').doc(id);

    batch.set(bookRef, bookDataWithoutId, { merge: true });
  });

  await batch.commit();
}

async function getBooksByIds(bookIds) {
  const books = await Promise.all(bookIds.map(async id => {
    const book = await firestore.collection('books').doc(id).get();
    if (!book.exists) {
      return null;
    }
    return { id, ...(book.data()) };
  }));

  return books;
}

async function getBooksWithProps(bookData = {}) {
  const filteredBooksRef = await createFilteredRef('books', bookData);

  const booksWithProps = await filteredBooksRef.get();
  const books = mapToDataWithId(booksWithProps);

  return books;
}

module.exports = {
  createBook,
  updateBooks,
  getBooksByIds,
  getBooksWithProps
};
