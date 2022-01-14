'use strict';

const readingLimit = (numberOfBooks) => Math.min(20, Math.floor(numberOfBooks/2) + 1);

module.exports = {
  readingLimit
};
