'use strict';

const { genreOptions } = require('../../options');

function compareBookLists(a,b) {
  if (a.year !== b.year) {
    return b.year-a.year;
  }
  const aIndex = genreOptions.findIndex(option => option.id === a.genre);
  const bIndex = genreOptions.findIndex(option => option.id === b.genre);
  return aIndex-bIndex;
}

function sortBookLists(bookLists) {
  const sortedBookList = bookLists.slice().sort(compareBookLists);
  return sortedBookList;
}


module.exports = {
  sortBookLists
};
