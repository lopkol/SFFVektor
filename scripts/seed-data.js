'use strict';

const { v4: uuidv4 } = require('uuid');
const { omit } = require('lodash');
const {
  randomItemFrom,
  distinctItemsFrom,
  generateRandomUser,
  generateRandomBookAlternative,
  generateRandomBook,
  generateRandomBookList,
  generateRandomAuthor
} = require('../test-helpers/generate-data');
const firestore = require('../src/server/dao/firestore');
const { allowedUsers } = require('../src/server/config');
const { clearCollection } = require('../test-helpers/firestore');
const { hashEmail, encrypt } = require('../src/server/adapters/crypto/crypto');

const batch = firestore.batch();

async function addUserToBatch(props) {
  const userId = uuidv4();

  const userDataToSave = generateRandomUser(props);
  const [hashedEmail, encryptedDetails] = await Promise.all([
    hashEmail(userDataToSave.email),
    encrypt(userDataToSave.email)
  ]);
  const dataToSave = {
    hashedEmail,
    encryptedDetails,
    ...omit(userDataToSave, 'email')
  };
  const newUserRef = await firestore.collection('users').doc(userId);
  await batch.set(newUserRef, dataToSave);
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

async function addAuthorToBatch(props = {}) {
  const authorId = uuidv4();
  const newAuthorRef = await firestore.collection('authors').doc(authorId);
  await batch.set(newAuthorRef, generateRandomAuthor(props));
  return authorId;
}

async function addAuthors(count) {
  const authorIds = await Promise.all(Array(count).fill(null).map(() => {
    const authorId = addAuthorToBatch();
    return authorId;
  }));
  return authorIds;
}

async function addBookAlternativeToBatch(props = {}) {
  const alternativeId = uuidv4();
  const newAlternativeRef = await firestore.collection('bookAlternatives').doc(alternativeId);
  await batch.set(newAlternativeRef, generateRandomBookAlternative(props));
  return alternativeId;
}

async function addAlternatives(count) {
  const alternativeIds = await Promise.all(Array(count).fill(null).map(() => {
    const alternativeId = addBookAlternativeToBatch();
    return alternativeId;
  }));
  return alternativeIds;
}

async function addBookToBatch(props = {}) {
  const bookId = uuidv4();
  const newBookRef = await firestore.collection('books').doc(bookId);
  await batch.set(newBookRef, omit(generateRandomBook(props), 'id'));
  return bookId;
}

async function addBooksWithRandomAuthorsAndAlternatives(count, authorIds, alternativeIds) {

  const bookIds = await Promise.all(
    Array(count).fill(null).map(async (element, index) => {
      const authorNumOfBook = randomItemFrom([1,1,1,1,1,1,2,3]);
      const authorIdsOfBook = distinctItemsFrom(authorIds, authorNumOfBook);

      const alternativeId = alternativeIds[index];

      const bookId = await addBookToBatch({ authorIds: authorIdsOfBook, alternativeIds: [alternativeId] });
      return bookId;
    })
  );
  return bookIds;
}

async function addBookListToBatch(props = { year: 2000, genre: 'scifi', juryIds: [], bookIds: [] }) {
  const bookListId = props.year + props.genre;
  const newBookListRef = await firestore.collection('bookLists').doc(bookListId);
  await batch.set(newBookListRef, generateRandomBookList(props));
}

async function seedDb() {
  await Promise.all([
    clearCollection('users'),
    clearCollection('books'),
    clearCollection('bookLists'),
    clearCollection('authors')
  ]);

  const stupidUserIds = await Promise.all([
    addUsersWithRole('admin', 3),
    addUsersWithRole('user', 20),
    ...allowedUsers.map(
      email => addUserToBatch({ email, role: 'admin' })
    )
  ]);
  const userIds = [...stupidUserIds[0], ...stupidUserIds[1], ...stupidUserIds.slice(2)];

  const authorIds = await addAuthors(60);
  const alternativeIds = await addAlternatives(80);
  const bookIds = await addBooksWithRandomAuthorsAndAlternatives(80, authorIds, alternativeIds);

  await Promise.all([
    addBookListToBatch({
      year: 2020,
      genre: 'scifi',
      bookIds: bookIds.slice(0, 19),
      juryIds: distinctItemsFrom(userIds, 9)
    }),
    addBookListToBatch({
      year: 2020,
      genre: 'fantasy',
      bookIds: bookIds.slice(19, 40),
      juryIds: distinctItemsFrom(userIds, 10)
    }),
    addBookListToBatch({
      year: 2019,
      genre: 'scifi',
      bookIds: bookIds.slice(40, 58),
      juryIds: distinctItemsFrom(userIds, 10)
    }),
    addBookListToBatch({
      year: 2019,
      genre: 'fantasy',
      bookIds: bookIds.slice(58),
      juryIds: distinctItemsFrom(userIds, 11)
    })
  ]);

  await batch.commit();
  console.log('seeding finished successfully');
}

(async () => {
  try {
    await seedDb();
  } catch (error) {
    console.log('seeding failed', error);
    process.exit(1);
  }
})();
