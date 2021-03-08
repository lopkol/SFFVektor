'use strict';

const { omit } = require('lodash');
const firestore = require('../firestore');
const { createFilteredRef, mapToDataWithId } = require('../helper-functions');
const { hashEmail, encrypt, decrypt } = require('../../adapters/crypto/crypto');

async function createUser(userData) {
  const [hashedEmail, encryptedDetails] = await Promise.all([
    hashEmail(userData.email),
    encrypt(userData.email)
  ]);
  const dataToSave = {
    hashedEmail,
    encryptedDetails,
    ...omit(userData, 'email')
  };
  const user = await firestore.collection('users').add(dataToSave);
  return user.id;
}

async function updateUser(id, userData) {
  let user = await firestore.collection('users').doc(id).get();
  if (!user.exists) {
    return null;
  }

  const userRef = firestore.collection('users').doc(id);

  if (!userData.email) {
    await userRef.set(userData, { merge: true });
  } else {
    const [hashedEmail, encryptedDetails] = await Promise.all([
      hashEmail(userData.email),
      encrypt(userData.email)
    ]);
    const dataToSave = {
      hashedEmail,
      encryptedDetails,
      ...omit(userData, 'email')
    };
    await userRef.set(dataToSave, { merge: true });
  }

  user = await userRef.get();
  const encryptedData = user.data().encryptedDetails;
  const updatedUserData = omit(user.data(), ['hashedEmail', 'encryptedDetails']);

  updatedUserData.email = await decrypt(encryptedData);

  return { id, ...updatedUserData };
}

async function getUserById(id, { withDetails = true } = {}) {
  const user = await firestore.collection('users').doc(id).get();
  if (!user.exists) {
    return null;
  }
  const encryptedData = user.data().encryptedDetails;
  const userData = omit(user.data(), ['hashedEmail', 'encryptedDetails']);

  if (!withDetails) {
    return { id, ...userData };
  }

  userData.email = await decrypt(encryptedData);

  return { id, ...userData };
}

async function getUsersWithProps(props = {}, { withDetails = true } = {}) {
  let queryObject;
  if (props.email) {
    const hashedEmail = await hashEmail(props.email);
    queryObject = {
      hashedEmail,
      ...omit(props, 'email')
    };
  } else {
    queryObject = props;
  }

  const filteredUsersRef = await createFilteredRef('users', queryObject);

  const userSnapshotsWithProps = await filteredUsersRef.get();
  const users = mapToDataWithId(userSnapshotsWithProps);

  const dataToReturn = await Promise.all(users.map(async user => {
    const encryptedData = user.encryptedDetails;
    const userData = omit(user, ['hashedEmail', 'encryptedDetails']);
    if (!withDetails) {
      return userData;
    }
    userData.email = await decrypt(encryptedData);
    return userData;
  }));

  return dataToReturn;
}

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getUsersWithProps
};
