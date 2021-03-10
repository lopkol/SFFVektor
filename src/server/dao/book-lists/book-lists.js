'use strict';

const firestore = require('../firestore');
const { createFilteredRef, mapToDataWithId } = require('../helper-functions');

async function createBookList(bookListData) {
  const id = bookListData.year + bookListData.genre;
  const bookList = await firestore.collection('bookLists').doc(id).get();
  if (bookList.exists) {
    return null;
  }
  
  await firestore.collection('bookLists').doc(id).set(bookListData);
  return id;
}

async function updateBookList(id, bookListDataToUpdate) {
  let bookList = await firestore.collection('bookLists').doc(id).get();
  if (!bookList.exists) {
    return null;
  }
  const bookListRef = firestore.collection('bookLists').doc(id);
  await bookListRef.set(bookListDataToUpdate, { merge: true });

  bookList = await bookListRef.get();
  return { id, ...(bookList.data()) };
}

async function getBookListById(id) {
  const bookList = await firestore.collection('bookLists').doc(id).get();
  if (!bookList.exists) {
    return null;
  }
  return { id, ...(bookList.data()) };
}

async function getBookListsWithProps(bookListData = {}) {
  const filteredBookListsRef = await createFilteredRef('bookLists', bookListData);

  const bookListsWithProps = await filteredBookListsRef.get();
  const bookLists = mapToDataWithId(bookListsWithProps);
  
  return bookLists;
}

async function getBookListsOfJuryMember(userId) {
  const bookListsOfJuryMember = await firestore.collection('bookLists').where('jury', 'array-contains', userId).get();
  const bookLists = mapToDataWithId(bookListsOfJuryMember);

  return bookLists;
}

module.exports = {
  createBookList,
  updateBookList,
  getBookListById,
  getBookListsWithProps,
  getBookListsOfJuryMember
};
