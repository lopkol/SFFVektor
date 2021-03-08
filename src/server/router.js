'use strict';

const express = require('express');
const router = express.Router();

router.use(express.json());
router.get('/users', require('./endpoints/get-users/get-users'));

module.exports = router;
