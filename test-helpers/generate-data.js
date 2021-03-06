'use strict';

const { roleOptions } = require('../src/options');

function randomIntBetween(min, max) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}
function randomItemFrom(array) {
  return array[randomIntBetween(0, array.length - 1)];
}
function randomString(length = 6) {
  return Math.random().toString(36).substr(2, length);
}
const capitalize = text => text[0].toUpperCase() + text.slice(1);

function randomEmail() {
  return randomString(randomIntBetween(5, 10)) + '@gmail.com';
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
  const molyUrl = '';
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

module.exports = {
  randomString,
  generateRandomUser,
  generateRandomBook
};
