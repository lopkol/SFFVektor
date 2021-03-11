'use strict';

const { pick } = require('lodash');
const firestore = require('../firestore');
const { createFilteredRef, mapToDataWithId } = require('../helper-functions');

const bookListProperties = ['year', 'genre', 'url', 'pendingUrl', 'juryIds', 'bookIds'];
const modifiableBookListProperties = ['url', 'pendingUrl', 'juryIds', 'bookIds'];

async function createBookList(bookListData) {
  const bookListDataToSave = pick(bookListData, bookListProperties);
  const id = bookListData.year + bookListData.genre;
  const bookList = await firestore.collection('bookLists').doc(id).get();
  if (bookList.exists) {
    return null;
  }
  
  await firestore.collection('bookLists').doc(id).set(bookListDataToSave);
  return id;
}

async function updateBookList(id, bookListData) {
  let bookList = await firestore.collection('bookLists').doc(id).get();
  if (!bookList.exists) {
    return null;
  }
  const bookListDataToSave = pick(bookListData, modifiableBookListProperties);
  const bookListRef = firestore.collection('bookLists').doc(id);
  await bookListRef.set(bookListDataToSave, { merge: true });

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
  const bookListDataToQuery = pick(bookListData, bookListProperties);
  const filteredBookListsRef = await createFilteredRef('bookLists', bookListDataToQuery);

  const bookListsWithProps = await filteredBookListsRef.get();
  const bookLists = mapToDataWithId(bookListsWithProps);
  
  return bookLists;
}

async function getBookListsOfJuryMember(userId) {
  const bookListsOfJuryMember = await firestore.collection('bookLists').where('juryIds', 'array-contains', userId).get();
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
