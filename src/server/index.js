'use strict';

const { port } = require('./config');
const app = require('./app');

app.listen(port);
console.log('Server started');
