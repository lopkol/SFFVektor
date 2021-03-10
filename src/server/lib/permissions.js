'use strict';

const { getUserById } = require('../dao/users/users');
const { getBookListById } = require('../dao/book-lists/book-lists');

async function isActiveUser(userId) {
  const userData = await getUserById(userId);
  return userData.role === 'admin' || userData.role === 'user';
}

async function isAdmin(userId) {
  const userData = await getUserById(userId);
  return userData.role === 'admin';
}

async function canViewBookList(userId, bookListId) {
  const [isAdminUser, bookListData] = await Promise.all([isAdmin(userId), getBookListById(bookListId)]);
  return isAdminUser || bookListData.jury.includes(userId);
}

module.exports = {
  isActiveUser,
  isAdmin,
  canViewBookList
};
