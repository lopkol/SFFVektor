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
  await bookListRef.update(bookListDataToSave);

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

async function updateBookListsOfJuryMember(userId, newBookListIds) {
  await firestore.runTransaction(async transaction => {
    const bookListsOfJuryMemberRefs = firestore.collection('bookLists').where('juryIds', 'array-contains', userId);
    const bookListsOfJuryMember = await transaction.get(bookListsOfJuryMemberRefs);
    let bookListIdsOfJuryMember = [];
    bookListsOfJuryMember.forEach(bookList => bookListIdsOfJuryMember.push(bookList.id));

    const bookListIdsToRemove = bookListIdsOfJuryMember.filter(bookListId => !newBookListIds.includes(bookListId));
    const bookListIdsToAdd = newBookListIds.filter(bookListId => !bookListIdsOfJuryMember.includes(bookListId));

    const bookListsToAdd = await Promise.all(bookListIdsToAdd.map(async bookListId => {
      const bookListRef = firestore.collection('bookLists').doc(bookListId);
      const bookList = await transaction.get(bookListRef);
      const juryIds = bookList.data().juryIds;
      return { ref: bookListRef, newJuryIds: juryIds.concat(userId) };
    }));

    const bookListsToRemove = await Promise.all(bookListIdsToRemove.map(async bookListId => {
      const bookListRef = firestore.collection('bookLists').doc(bookListId);
      const bookList = await transaction.get(bookListRef);
      const juryIds = bookList.data().juryIds;
      return { ref: bookListRef, newJuryIds: juryIds.filter(juryId => juryId !== userId) };
    }));
  
    const bookListsToUpdate = bookListsToAdd.concat(bookListsToRemove);
    await Promise.all(bookListsToUpdate.map(async bookListData => {
      await transaction.update(bookListData.ref, { juryIds: bookListData.newJuryIds });
    }));
  });
}

module.exports = {
  createBookList,
  updateBookList,
  getBookListById,
  getBookListsWithProps,
  getBookListsOfJuryMember,
  updateBookListsOfJuryMember
};
