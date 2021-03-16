'use strict';

const firestore = require('../firestore');
const { pick } = require('lodash');
const { constructQuery, mapToDataWithId } = require('../helper-functions');

const bookProperties = [
  'authorIds', //array
  'title', 
  'series', 
  'seriesNum', 
  'isApproved', //boolean
  'isPending',  //boolean
  'alternativeIds' //array
];

async function createBook(bookData) { 
  const bookDataToSave = pick(bookData, bookProperties);
  const book = await firestore.collection('books').add(bookDataToSave);
  return book.id;
} 

async function setBooks(booksData) {
  const batch = firestore.batch();

  booksData.forEach(bookData => {
    const id = bookData.id;
    const bookDataToSave = pick(bookData, bookProperties);
    const bookRef = firestore.collection('books').doc(id);

    batch.set(bookRef, bookDataToSave, { merge: true });
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
  const bookDataToQuery = pick(bookData, bookProperties);
  const filteredBooksRef = await constructQuery('books', bookDataToQuery);

  const booksWithProps = await filteredBooksRef.get();
  const books = mapToDataWithId(booksWithProps);

  return books;
}

module.exports = {
  createBook,
  setBooks,
  getBooksByIds,
  getBooksWithProps
};
