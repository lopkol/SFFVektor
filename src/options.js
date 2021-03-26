'use strict';

const roleOptions = [
  { id: 'admin', name: 'admin' },
  { id: 'user', name: 'zsűri' },
  { id: 'inactive', name: 'inaktív' }
];

const genreOptions = [
  { id: 'fantasy', name: 'fantasy' },
  { id: 'scifi', name: 'sci-fi' }
];

const readingPlanOptions = [
  { id: 'noPlan', name: 'nincs megadva' },
  { id: 'willRead', name: 'el fogom olvasni' },
  { id: 'willNotRead', name: 'nem fogom elolvasni' },
  { id: 'isReading', name: 'éppen olvasom' },
  { id: 'finished', name: 'elolvastam' }
];

module.exports = {
  roleOptions,
  genreOptions,
  readingPlanOptions
};
