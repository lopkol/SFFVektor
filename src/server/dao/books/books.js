'use strict';

const firestore = require('../firestore');
const { omit } = require('lodash');

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
    const bookData = { id, ...(book.data()) };
    return bookData;
  }));

  return books;
}

async function getBooksWithProps(bookData = {}) {
  const allBooksRef = await firestore.collection('books');

  const properties = Object.entries(bookData);

  const filteredBooksRef = await properties.reduce(async (lastRef, [propKey, propValue]) => {
    const newRef = (await lastRef).where(propKey, '==', propValue);
    return newRef;
  }, allBooksRef);

  const booksWithProps = await filteredBooksRef.get();
  const books = [];
  booksWithProps.forEach(document => {
    books.push({
      id: document.id,
      ...(document.data())
    });
  });

  return books;
}

module.exports = {
  createBook,
  updateBooks,
  getBooksByIds,
  getBooksWithProps
};
