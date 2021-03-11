'use strict';

const { getUsersWithProps } = require('../src/server/dao/users/users');
const { getBookListById } = require('../src/server/dao/book-lists/book-lists');

(async () => {
  console.log(await getUsersWithProps());
  console.log(await getBookListById('2020fantasy'));
})();
