'use strict';

const { v4: uuidv4 } = require('uuid');
const { roleOptions, genreOptions, readingPlanOptions } = require('../src/options');
const years = [1977, 1976, 1975, 1974, 1973];

const surnames = ['kovács', 'szabó', 'lakatos', 'kolompár', 'vastag', 'szőrös', 'pumpás', 'gonosz', 'csúnya', 'kövér', 'tóth', 'nagy', 'kis'];
const givenNames = ['oszkár', 'béla', 'lajos', 'géza', 'tihamér', 'ildikó', 'katalin', 'anikó', 'rozi', 'nikolett', 'kristóf', 'andrás', 'dezső', 'ferenc', 'lili'];

const adjectives = ['titokzatos', 'kegyetlen', 'földönkívüli', 'csúnya', 'gonosz', 'szőrös', 'kövér', 'láthatatlan', 'péniszfejű', 'vonatpótló autóbusszal közlekedő', 'náthás', 'féltékeny', 'harapós'];
const actors = ['törpék', 'alienek', 'majomkutyák', 'törpenyulak', 'orkok', 'amazonok', 'kísértetek', 'kecskék', 'szerzetesek', 'mágusok', 'óriáskígyók', 'fenyőfák', 'szoftverfejlesztők'];
const actions = ['lázadása', 'véres bosszúja', 'támadása', 'titka', 'rejtélye', 'háborúja', 'szigete', 'hihetetlen kalandjai', 'reneszánsza', 'örök körforgása', 'szexuális élete'];

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

function removeHungarianAccents(str) {
  return str
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/[óöő]/g, 'o')
    .replace(/[úüű]/g, 'u');
}

function turnToUrl(str) {
  return removeHungarianAccents(str).replace(/\s/g, '-').toLowerCase();
}

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
    email: `${removeHungarianAccents(surname + '.' + givenName)}.${randomInt}@gmail.com`,
    molyUserName: removeHungarianAccents(`${surname}${givenName}${randomInt}`),
    ...props
  };
}

function generateRandomBookAlternative(props = {}) {
  const name = randomItemFrom(['magyar', 'eredeti', 'angol', 'német', 'francia']);
  const url = randomString(15, 30);

  return {
    name,
    urls: [{ sequenceId: 1, url }],
    ...props
  };
}

function generateRandomBook(props = {}) {
  const adjective = randomItemFrom(adjectives);
  const actor = randomItemFrom(actors);
  const action = randomItemFrom(actions);
  const authorNum = randomItemFrom([1,1,1,1,1,1,2,3]);
  const authorIds = Array(authorNum).fill(null).map(() => uuidv4());

  return {
    id: uuidv4(),
    authorIds,
    title: `A ${adjective} ${actor} ${action}`,
    series: `${capitalize(adjective)} ${actor}`,
    seriesNum: randomIntBetween(1,6),
    isApproved: randomBoolean(),
    isPending: randomBoolean(),
    alternativeIds: [],
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
  const year = props.year || randomItemFrom(years);
  const genre = props.genre || (randomItemFrom(genreOptions)).id;
  const longNameOfGenre = genre === 'fantasy' ? 'fantasy' : 'science fiction';
  const nameOfList = `${yearWithSuffix(year, 'es')} ${longNameOfGenre} megjelenések`;
  const nameOfPendingShelf = `Besorolásra vár ${year}`;
  const url = `https://moly.hu/listak/${turnToUrl(nameOfList)}`;
  const pendingUrl = `https://moly.hu/polcok/${turnToUrl(nameOfPendingShelf)}`;
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
  yearWithSuffix,
  removeHungarianAccents,
  turnToUrl,
  randomString,
  randomItemFrom,
  distinctItemsFrom,
  generateRandomAuthor,
  generateRandomUser,
  generateRandomBookAlternative,
  generateRandomBook,
  generateRandomReadingPlan,
  generateRandomBookList
};
