'use strict';

const { v4: uuidv4 } = require('uuid');
const { omit } = require('lodash');
const { distinctItemsFrom, generateRandomUser, generateRandomBook, generateRandomBookList } = require('../test-helpers/generate-data');
const firestore = require('../src/server/dao/firestore');
const { allowedUsers } = require('../src/server/config');
const { clearCollection } = require('../test-helpers/firestore');
const { hashEmail, encrypt } = require('../src/server/adapters/crypto/crypto');

const batch = firestore.batch();

async function addUserToBatch(props = {}) {
  const userId = uuidv4();
  const newUserRef = await firestore.collection('users').doc(userId);

  const userData = generateRandomUser(props);
  const hashedEmail = await hashEmail(props.email);
  const encryptedDetails = await encrypt(props.email);
  const userDataToSave = {
    hashedEmail,
    encryptedDetails,
    ...omit(userData, 'email')
  };

  await batch.set(newUserRef, userDataToSave);
  return userId;
}

async function addUsersWithRole(role, count) {
  const userIds = await Promise.all(
    Array(count).fill(null).map(() => {
      const userId = addUserToBatch({ role });
      return userId;
    })
  );
  return userIds;
}

async function addBookToBatch(props = {}) {
  const bookId = uuidv4();
  const newBookRef = await firestore.collection('books').doc(bookId);
  await batch.set(newBookRef, omit(generateRandomBook(props), 'id'));
  return bookId;
}

async function addBooks(count) {
  const bookIds = await Promise.all(
    Array(count).fill(null).map(() => {
      const bookId = addBookToBatch();
      return bookId;
    })
  );
  return bookIds;
}

async function addBookListToBatch(props = { year: 2000, genre: 'scifi', jury: [], books: [] }) {
  const bookListId = props.year + props.genre;
  const newBookListRef = await firestore.collection('bookLists').doc(bookListId);
  await batch.set(newBookListRef, generateRandomBookList(props));
}

(async () => {
  await clearCollection('users');
  await clearCollection('books');
  await clearCollection('bookLists');

  const userIds = await Promise.all([
    ...addUsersWithRole('admin', 3),
    ...addUsersWithRole('user', 16),
    ...allowedUsers.map(
      email => addUserToBatch({ email, role: 'admin' })
    )
  ]);

  const bookIds = await addBooks(80);

  await addBookListToBatch({ 
    year: 2000, 
    genre: 'scifi', 
    books: bookIds.slice(0, 19),
    jury: distinctItemsFrom(userIds, 9) 
  });
  await addBookListToBatch({ 
    year: 2000, 
    genre: 'fantasy', 
    books: bookIds.slice(19, 40),
    jury: distinctItemsFrom(userIds, 10) 
  });
  await addBookListToBatch({ 
    year: 1999, 
    genre: 'scifi', 
    books: bookIds.slice(40, 58),
    jury: distinctItemsFrom(userIds, 10) 
  });
  await addBookListToBatch({ 
    year: 1999, 
    genre: 'fantasy', 
    books: bookIds.slice(58),
    jury: distinctItemsFrom(userIds, 11) 
  });
  
  await batch.commit();
})();
