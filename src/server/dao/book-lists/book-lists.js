'use strict';

const firestore = require('../firestore');

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

async function getBookListsWithProps(bookListData = {}) {
  const allBookListsRef = await firestore.collection('bookLists');

  const properties = Object.entries(bookListData);

  const filteredBookListsRef = await properties.reduce(async (lastRef, [propKey, propValue]) => {
    const newRef = (await lastRef).where(propKey, '==', propValue);
    return newRef;
  }, allBookListsRef);

  const bookListsWithProps = await filteredBookListsRef.get();
  const bookLists = [];
  bookListsWithProps.forEach(async document => {
    bookLists.push({
      id: document.id,
      ...(document.data())
    });
  });

  return bookLists;
}

async function getBookListsOfJuryMember(userId) {
  const bookListsOfJuryMember = await firestore.collection('bookLists').where('jury', 'array-contains', userId).get();
  const bookLists = [];
  bookListsOfJuryMember.forEach(async document => {
    bookLists.push((await document).data());
    bookLists[bookLists.length - 1].id = document.id;
  });

  return bookLists;
}

module.exports = {
  createBookList,
  updateBookList,
  getBookListsWithProps,
  getBookListsOfJuryMember
};
