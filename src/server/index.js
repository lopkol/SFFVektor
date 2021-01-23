'use strict';

const express = require('express');
const path = require('path');
const { port } = require('./config');

const app = express();
app.use('/', express.static(path.join(__dirname, '../static')));

app.listen(port);
console.log('Server started');
