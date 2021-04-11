'use strict';

const express = require('express');
const jwtMiddleware = require('./endpoints/middlewares/jwt-middleware');
const router = express.Router();

router.use(express.json(), jwtMiddleware);

router.get('/user', require('./endpoints/users/get-own-data/get-own-data'));
router.get('/users', require('./endpoints/users/get-users/get-users'));
router.get('/users/:userId', require('./endpoints/users/get-user/get-user'));
router.post('/users/new', require('./endpoints/users/create-user/create-user'));
router.patch('/users/:userId', require('./endpoints/users/update-user/update-user'));

router.get('/book-lists/:year/:genre', require('./endpoints/book-lists/get-book-list/get-book-list'));
router.post('/book-lists/:year/:genre/moly-update', require('./endpoints/book-lists/update-from-moly/update-from-moly'));

module.exports = router;
