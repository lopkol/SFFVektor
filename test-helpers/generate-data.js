'use strict';

const { v4: uuidv4 } = require('uuid');
const { roleOptions, genreOptions, readingPlanOptions } = require('../src/options');
const years = [1977, 1976, 1975, 1974, 1973];

const surnames = ['kovács', 'szabó', 'lakatos', 'kolompár', 'vastag', 'szőrös', 'pumpás', 'gonosz', 'csúnya', 'kövér'];
const givenNames = ['oszkár', 'béla', 'lajos', 'géza', 'tihamér', 'ildikó', 'katalin', 'anikó', 'rozi', 'nikolett'];

const adjectives = ['titokzatos', 'kegyetlen', 'földönkívüli', 'csúnya', 'gonosz', 'szőrös', 'kövér', 'láthatatlan', 'péniszfejű', 'vonatpótló autóbusszal közlekedő'];
const actors = ['törpék', 'alienek', 'majomkutyák', 'törpenyulak', 'orkok', 'amazonok', 'kísértetek', 'kecskék', 'szerzetesek', 'mágusok'];
const actions = ['lázadása', 'véres bosszúja', 'támadása', 'titka', 'rejtélye', 'háborúja', 'szigete', 'hihetetlen kalandjai', 'reneszánsza', 'örök körforgása'];

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
const randomBoolean = () => randomItemFrom([true, false]);

function generateRandomAuthor(props = {}) {
  const surname = capitalize(randomItemFrom(surnames));
  const givenName = capitalize(randomItemFrom(givenNames));

  return {
    name:`${surname} ${givenName}` ,
    sortName: `${surname}, ${givenName}`,
    isApproved: randomBoolean(),
    ...props
  };
}

function generateRandomUser(props = {}) {
  const surname = randomItemFrom(surnames);
  const givenName = randomItemFrom(givenNames);
  const randomInt = randomIntBetween(1, 1000);

  return {
    role: randomItemFrom(roleOptions).id,
    name: `${capitalize(surname)} ${capitalize(givenName)}`,
    email: `${surname}.${givenName}.${randomInt}@gmail.com`,
    molyUserName: `${surname}${givenName}${randomInt}`,
    ...props
  };
}

function generateRandomBook(props = {}) {
  const adjective = randomItemFrom(adjectives);
  const actor = randomItemFrom(actors);
  const action = randomItemFrom(actions);
  const molyUrlPath = `a ${adjective} ${actor} ${action}`.replace(/\s/g, '-');

  return {
    id: uuidv4(),
    authorId: uuidv4(),
    title: `A ${adjective} ${actor} ${action}`,
    molyUrl: `moly.hu/konyvek/${molyUrlPath}`,
    series: `${capitalize(adjective)} ${actor}`,
    seriesNum: randomIntBetween(1,6),
    isApproved: randomBoolean(),
    isPending: randomBoolean(),
    alternatives: [],
    ...props
  };
}

function generateRandomReadingPlan(props = {}) {
  const userId = uuidv4();
  const bookId = uuidv4();
  const status = randomItemFrom(readingPlanOptions.map(statusOption => statusOption.id));

  return {
    userId,
    bookId,
    status,
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
  generateRandomReadingPlan,
  generateRandomBookList
};
