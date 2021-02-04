'use strict';

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const app = express();

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(cookieParser());
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', require('./endpoints/get/get'));
app.get('/auth', require('./endpoints/auth'));
app.get('/users', require('./endpoints/get-users/get-users'));

module.exports = app;
