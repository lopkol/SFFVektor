'use strict';

const { roleOptions, genreOptions } = require('../src/options');
const years = [1977, 1976, 1975, 1974, 1973];

function randomIntBetween(min, max) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}
function randomItemFrom(array) {
  return array[randomIntBetween(0, array.length - 1)];
}

function distinctItemsFrom(array, minCount, maxCount = minCount) {
  if (minCount > array.length || minCount > maxCount) {
    throw new Error(`Invalid parameters: ${JSON.stringify({ array, minCount, maxCount }, null, 2)}`);
  }
  const max = Math.min(array.length, maxCount);
  const count = randomIntBetween(minCount, max);
  const result = [];
  const remainingOptions = array.slice();

  while (result.length < count) {
    const nextIndex = randomIntBetween(0, remainingOptions.length - 1);
    result.push(remainingOptions[nextIndex]);
    remainingOptions.splice(nextIndex, 1);
  }

  return result;
}

function randomString(length = 6) {
  return Math.random().toString(36).substr(2, length);
}
const capitalize = text => text[0].toUpperCase() + text.slice(1);

function randomEmail() {
  return randomString(randomIntBetween(5, 10)) + '@gmail.com';
}

function generateRandomAuthor(props = {}) {
  const firstName = capitalize(randomString(randomIntBetween(5,12)));
  const lastName = capitalize(randomString(randomIntBetween(5,12)));
  const name = firstName + ' ' + lastName;
  const sortName = lastName + ', ' + firstName;
  const isApproved = randomItemFrom([true, false]);
  return {
    name,
    sortName,
    isApproved,
    ...props
  };
}

function generateRandomUser(props = {}) {
  const role = randomItemFrom(roleOptions).id;
  const name = capitalize(randomString(randomIntBetween(5,12)));
  const email = randomEmail();
  const molyUserName = randomString(4,10);

  return {
    role,
    name,
    email,
    molyUserName,
    ...props
  };
}

function generateRandomBook(props = {}) {
  const id = String(randomIntBetween(100000, 1000000));
  const authorId = String(randomIntBetween(100000, 1000000));
  const title = capitalize(randomString(randomIntBetween(7, 25)));
  const molyUrl = randomString(16,34);
  const series = capitalize(randomString(randomIntBetween(7, 25)));
  const seriesNum = randomIntBetween(1,4);
  const isApproved = randomItemFrom([true, false]);
  const isPending = randomItemFrom([true, false]);
  const alternatives = [];

  return {
    id,
    authorId,
    title,
    molyUrl,
    series,
    seriesNum,
    isApproved,
    isPending,
    alternatives,
    ...props
  };
}

function generateRandomBookList(props = {}) {
  const year = randomItemFrom(years);
  const genre = (randomItemFrom(genreOptions)).id;
  const url = randomString(randomIntBetween(13, 25));
  const pendingUrl = randomString(randomIntBetween(13, 25));
  const juryIds = [];
  const bookIds = [];

  return {
    year,
    genre,
    url,
    pendingUrl,
    juryIds,
    bookIds,
    ...props
  };
}

module.exports = {
  randomString,
  distinctItemsFrom,
  generateRandomAuthor,
  generateRandomUser,
  generateRandomBook,
  generateRandomBookList
};
