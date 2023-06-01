'use strict';

const { genreOptions } = require('../../options');

function compareBookLists(a, b) {
  if (a.year !== b.year) {
    return b.year - a.year;
  }
  const aIndex = genreOptions.findIndex(option => option.id === a.genre);
  const bIndex = genreOptions.findIndex(option => option.id === b.genre);
  return aIndex - bIndex;
}

function sortBookLists(bookLists) {
  const sortedBookList = bookLists.slice().sort(compareBookLists);
  return sortedBookList;
}

function sortAuthors(authors) {
  const sortedAuthors = authors
    .slice()
    .sort((a, b) => a.sortName.localeCompare(b.sortName, 'en', { ignorePunctuation: true }));
  return sortedAuthors;
}

function compareBooksByAuthors(a, b) {
  const authorsOfA = sortAuthors(a.authors);
  const authorsOfB = sortAuthors(b.authors);
  const authorsStringOfA = authorsOfA.map(author => author.sortName).join(' ');
  const authorsStringOfB = authorsOfB.map(author => author.sortName).join(' ');
  return authorsStringOfA.localeCompare(authorsStringOfB, 'en', { ignorePunctuation: true });
}

function compareBooks(a, b) {
  const authorComparison = compareBooksByAuthors(a, b);
  if (authorComparison !== 0) {
    return authorComparison;
  }
  if (!a.series) {
    if (!b.series) {
      return a.title.localeCompare(b.title, 'en', { ignorePunctuation: true });
    } else {
      return a.title.localeCompare(b.series, 'en', { ignorePunctuation: true });
    }
  }
  if (!b.series) {
    return a.series.localeCompare(b.title, 'en', { ignorePunctuation: true });
  }
  if (a.series !== b.series) {
    return a.series.localeCompare(b.series, 'en', { ignorePunctuation: true });
  }
  if (a.seriesNum && b.seriesNum) {
    return parseFloat(a.seriesNum) - parseFloat(b.seriesNum);
  }
  return 0;
}

function sortBooks(books) {
  const sortedBooks = books.slice().sort(compareBooks);
  return sortedBooks;
}

function getAuthorAndTitle(book) {
  const authors = sortAuthors(book.authors);
  const authorsString = authors.map(author => author.name).join(', ');
  return `${authorsString}: ${book.title}`;
}

function yearWithSuffix(year, suffixType) {
  const types = ['ben', 'es', 'től', 'ből', 're', 'ről', 'hez', 'nek', 'vel'];
  if (!types.includes(suffixType)) {
    throw new Error(`Invalid parameters, suffix type must be among ${JSON.stringify(types)}`);
  }
  const suffixesForEndings = [
    { endRegEx: /[14]$/, suffixes: ['ben', 'es', 'től', 'ből', 're', 'ről', 'hez', 'nek', 'gyel'] },
    { endRegEx: /2$/, suffixes: ['ben', 'es', 'től', 'ből', 're', 'ről', 'höz', 'nek', 'vel'] },
    { endRegEx: /3$/, suffixes: ['ban', 'as', 'tól', 'ból', 'ra', 'ról', 'hoz', 'nak', 'mal'] },
    { endRegEx: /5$/, suffixes: ['ben', 'ös', 'től', 'ből', 're', 'ről', 'höz', 'nek', 'tel'] },
    { endRegEx: /6$/, suffixes: ['ban', 'os', 'tól', 'ból', 'ra', 'ról', 'hoz', 'nak', 'tal'] },
    { endRegEx: /7$/, suffixes: ['ben', 'es', 'től', 'ből', 're', 'ről', 'hez', 'nek', 'tel'] },
    { endRegEx: /8$/, suffixes: ['ban', 'as', 'tól', 'ból', 'ra', 'ról', 'hoz', 'nak', 'cal'] },
    { endRegEx: /9$/, suffixes: ['ben', 'es', 'től', 'ből', 're', 'ről', 'hez', 'nek', 'cel'] },
    { endRegEx: /10$/, suffixes: ['ben', 'es', 'től', 'ből', 're', 'ről', 'hez', 'nek', 'zel'] },
    { endRegEx: /20$/, suffixes: ['ban', 'as', 'tól', 'ból', 'ra', 'ról', 'hoz', 'nak', 'szal'] },
    { endRegEx: /30$/, suffixes: ['ban', 'as', 'tól', 'ból', 'ra', 'ról', 'hoz', 'nak', 'cal'] },
    { endRegEx: /[4579]0$/, suffixes: ['ben', 'es', 'től', 'ből', 're', 'ről', 'hez', 'nek', 'nel'] },
    { endRegEx: /[68]0$/, suffixes: ['ban', 'as', 'tól', 'ból', 'ra', 'ról', 'hoz', 'nak', 'nal'] },
    { endRegEx: /[1-9]00$/, suffixes: ['ban', 'as', 'tól', 'ból', 'ra', 'ról', 'hoz', 'nak', 'zal'] },
    { endRegEx: /000$/, suffixes: ['ben', 'es', 'től', 'ből', 're', 'ről', 'hez', 'nek', 'rel'] }
  ];

  const suffixesOfYear = suffixesForEndings.find(number => number.endRegEx.test(year)).suffixes || types;
  const typeIndex = types.indexOf(suffixType);

  return `${year}-${suffixesOfYear[typeIndex]}`;
}

function nameOfBookList(bookListId) {
  const year = bookListId.slice(0, 4);
  const genre = bookListId.slice(4);
  const genreName = genreOptions.find(option => option.id === genre).name;
  return `${yearWithSuffix(year, 'es')} ${genreName} jelöltlista`;
}

function equalAsSets(array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    if (!array2.includes(array1[i])) {
      return false;
    }
  }
  for (let i = 0; i < array2.length; i++) {
    if (!array1.includes(array2[i])) {
      return false;
    }
  }
  return true;
}

const capitalize = text => text[0].toUpperCase() + text.slice(1);

module.exports = {
  sortBookLists,
  sortAuthors,
  sortBooks,
  getAuthorAndTitle,
  nameOfBookList,
  equalAsSets,
  capitalize
};
