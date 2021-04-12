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
