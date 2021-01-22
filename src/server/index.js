'use strict';

const path = require('path');

const express = require('express');
const app = express();

const port = 9966;

app.use('/', express.static(path.join(__dirname, '../static')));

app.listen(port);
console.log(`Server listening on http://localhost:${port}`);
