'use strict';

const express = require('express');
const jwtMiddleware = require('./endpoints/middlewares/jwt-middleware');
const router = express.Router();

router.use(express.json(), jwtMiddleware);

router.get('/user', require('./endpoints/users/get-self/get-self'));
router.get('/users', require('./endpoints/users/get-all/get-all'));
router.get('/users/:userId', require('./endpoints/users/get/get'));
router.post('/users/new', require('./endpoints/users/create/create'));
router.patch('/users/:userId', require('./endpoints/users/update/update'));

router.get('/book-lists', require('./endpoints/book-lists/get-all/get-all'));
router.get('/book-lists/:bookListId', require('./endpoints/book-lists/get/get'));
router.post('/book-lists/new', require('./endpoints/book-lists/create/create'));
router.patch('/book-lists/:bookListId', require('./endpoints/book-lists/update/update'));
router.post(
  '/book-lists/:bookListId/moly-update',
  require('./endpoints/book-lists/update-from-moly/update-from-moly')
);

router.get('/books-from-year/:year', require('./endpoints/books/get-by-year/get-by-year'));
router.get('/books/:bookId', require('./endpoints/books/get/get'));
router.patch('/books/:bookId', require('./endpoints/books/update/update'));

router.get('/authors', require('./endpoints/authors/get-all/get-all'));
router.get('/authors/:authorId', require('./endpoints/authors/get/get'));
router.post('/authors/new', require('./endpoints/authors/create/create'));
router.patch('/authors/:authorId', require('./endpoints/authors/update/update'));

router.get(
  '/book-alternatives/:bookAlternativeId',
  require('./endpoints/book-alternatives/get/get')
);
router.post('/book-alternatives/new', require('./endpoints/book-alternatives/create/create'));
router.patch(
  '/book-alternatives/:bookAlternativeId',
  require('./endpoints/book-alternatives/update/update')
);

router.get('/reading-plans/own/:bookListId', require('./endpoints/reading-plans/get-own/get-own'));
router.put(
  '/reading-plans/own/:bookListId',
  require('./endpoints/reading-plans/update-own/update-own')
);
router.get(
  '/reading-plans/all/:bookListId',
  require('./endpoints/reading-plans/get-all-for-booklist/get-all-for-booklist')
);

module.exports = router;
