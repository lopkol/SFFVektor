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
  { id: 'noPlan', name: 'még nem tudom' },
  { id: 'willRead', name: 'olvasni fogom' },
  { id: 'willNotRead', name: 'nem fogom elolvasni' },
  { id: 'isReading', name: 'éppen olvasom' },
  { id: 'finished', name: 'olvastam' }
];

module.exports = {
  roleOptions,
  genreOptions,
  readingPlanOptions
};
