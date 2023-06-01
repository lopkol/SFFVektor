'use strict';

const roleOptions = [
  { id: 'admin', name: 'admin' },
  { id: 'user', name: 'aktív zsűri' },
  { id: 'inactive', name: 'inaktív' }
];

const genreOptions = [
  { id: 'scifi', name: 'sci-fi' },
  { id: 'fantasy', name: 'fantasy' }
];

const readingPlanOptions = [
  { id: 'noPlan', name: '-' },
  { id: 'willRead', name: 'tervezem' },
  { id: 'willNotRead', name: 'nem fogom elolvasni' },
  { id: 'isReading', name: 'éppen olvasom' },
  { id: 'finished', name: 'olvastam' }
];

const readingLimit = numberOfBooks => Math.min(20, Math.floor(numberOfBooks / 2) + 1);

module.exports = {
  roleOptions,
  genreOptions,
  readingPlanOptions,
  readingLimit
};
