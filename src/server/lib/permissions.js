'use strict';

const { getUsersByIds } = require('../dao/users/users');
const { getBookListById } = require('../dao/book-lists/book-lists');

async function isActiveUser(userId) {
  const [userData] = await getUsersByIds([userId]);
  if (!userData) {
    return false;
  }
  return userData.role === 'admin' || userData.role === 'user';
}

async function isAdmin(userId) {
  const [userData] = await getUsersByIds([userId]);
  if (!userData) {
    return false;
  }
  return userData.role === 'admin';
}

async function canEditReadingPlans(userId, bookListId) {
  const isActive = await isActiveUser(userId);
  if (!isActive) {
    return false;
  }
  const [isAdminUser, bookListData] = await Promise.all([isAdmin(userId), getBookListById(bookListId)]);
  if (!bookListData) {
    return false;
  }
  return isAdminUser || bookListData.juryIds.includes(userId);
}

async function canManageUsers(userId) {
  return await isAdmin(userId);
}

async function canManageBookLists(userId) {
  return await isAdmin(userId);
}

module.exports = {
  isActiveUser,
  isAdmin,
  canEditReadingPlans,
  canManageUsers,
  canManageBookLists
};
