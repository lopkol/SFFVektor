'use strict';

const { getUsersWithProps } = require('../src/server/dao/user/user');

(async () => {
  await console.log(await getUsersWithProps());
})();
