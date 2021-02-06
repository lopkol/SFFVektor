'use strict';

//const cookieParser = require('cookie-parser');
const express = require('express');
const router = express.Router();

router.get('/users', require('./endpoints/get-users/get-users'));

module.exports = router;
