'use strict';

const { omit, pick } = require('lodash');
const firestore = require('../firestore');
const { constructQuery, mapToDataWithId } = require('../helper-functions');
const { hashEmail, encrypt, decrypt } = require('../../adapters/crypto/crypto');

const userProperties = ['email', 'name', 'role', 'molyUsername', 'molyUrl'];
//const userPropertiesInDb = ['hashedEmail', 'name', 'role', 'molyUsername', 'molyUrl', 'encryptedDetails'];

async function createUser(userData) {
  const userDataToSave = pick(userData, userProperties);
  const [hashedEmail, encryptedDetails] = await Promise.all([
    hashEmail(userDataToSave.email),
    encrypt(userDataToSave.email)
  ]);

  const usersWithSameEmail = await firestore.collection('users').where('hashedEmail', '==', hashedEmail).get();

  if (!usersWithSameEmail.empty) {
    return null;
  }
  
  const dataToSave = {
    hashedEmail,
    encryptedDetails,
    ...omit(userDataToSave, 'email')
  };
  const user = await firestore.collection('users').add(dataToSave);
  return user.id;
}

async function updateUser(id, userData) {
  const userDataToSave = pick(userData, userProperties);
  try {
    const userRef = firestore.collection('users').doc(id);

    if (!userDataToSave.email) {
      await userRef.update(userDataToSave);
    } else {
      const [hashedEmail, encryptedDetails] = await Promise.all([
        hashEmail(userDataToSave.email),
        encrypt(userDataToSave.email)
      ]);

      const dataToSave = {
        hashedEmail,
        encryptedDetails,
        ...omit(userDataToSave, 'email')
      };

      await userRef.update(dataToSave);
    }
  } catch (error) {
    return null;
  }

  const user = await firestore.collection('users').doc(id).get();
  const encryptedData = user.data().encryptedDetails;
  const updatedUserData = omit(user.data(), ['hashedEmail', 'encryptedDetails']);

  updatedUserData.email = await decrypt(encryptedData);

  return { id, ...updatedUserData };
}

async function getUsersByIds(userIds, { withDetails = true } = {}) {
  const users = await Promise.all(userIds.map(async id => {
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
  }));

  return users;
}

async function getUsersWithProps(props = {}, { withDetails = true } = {}) {
  const userDataToQuery = pick(props, userProperties);
  let queryObject;
  if (userDataToQuery.email) {
    const hashedEmail = await hashEmail(props.email);
    queryObject = {
      hashedEmail,
      ...omit(userDataToQuery, 'email')
    };
  } else {
    queryObject = userDataToQuery;
  }

  const filteredUsersRef = await constructQuery('users', queryObject);

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

async function deleteUser(id) {
  const userRef = firestore.collection('users').doc(id);
  const user = await userRef.get();
  if (!user.exists) {
    return null;
  }
  await userRef.delete();

  const encryptedData = user.data().encryptedDetails;
  const userData = omit(user.data(), ['hashedEmail', 'encryptedDetails']);
  userData.email = await decrypt(encryptedData);

  return { id, ...userData };
}

module.exports = {
  createUser,
  updateUser,
  getUsersByIds,
  getUsersWithProps,
  deleteUser
};
