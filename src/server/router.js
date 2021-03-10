'use strict';

const express = require('express');
const jwtMiddleware = require('./endpoints/middlewares/jwt-middleware');
const router = express.Router();

router.use(express.json(), jwtMiddleware);
router.get('/users', require('./endpoints/users/get/get-users'));
router.get('/book-lists/:year/:genre', require('./endpoints/book-lists/get/get-book-list'));

module.exports = router;
