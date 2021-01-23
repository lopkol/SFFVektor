'use strict';

const express = require('express');
const path = require('path');
const { port, resourceBaseUrl } = require('./config');

const app = express();

app.set('views', path.resolve(__dirname, 'views'));

app.get('/', async (req, res) => {
  try {
    await res.render('index.ejs', { resourceBaseUrl });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(port);
console.log('Server started');
