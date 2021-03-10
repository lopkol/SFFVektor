'use strict';

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const app = express();
const apiRouter = require('./router');

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(cookieParser());
app.set('views', path.resolve(__dirname, 'views'));

app.get('/auth', require('./endpoints/auth/auth'));
app.use('/api', apiRouter);
app.get('*', require('./endpoints/get/get'));

module.exports = app;
