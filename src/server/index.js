'use strict';

const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const { port } = require('./config');

const app = express();

app.use(cookieParser());
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', require('./endpoints/get'));
app.get('/auth', require('./endpoints/auth'));

app.listen(port);
console.log('Server started');
