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

router.get('/book-lists', require('./endpoints/book-lists/get-book-lists/get-book-lists'));
router.get('/book-lists/:bookListId', require('./endpoints/book-lists/get-book-list/get-book-list'));
router.post('/book-lists/new', require('./endpoints/book-lists/create-book-list/create-book-list'));
router.patch('/book-lists/:bookListId', require('./endpoints/book-lists/update-book-list/update-book-list'));
router.post('/book-lists/:bookListId/moly-update', require('./endpoints/book-lists/update-from-moly/update-from-moly'));

router.get('/books-from-year/:year', require('./endpoints/books/get-books/get-books'));
router.get('/books/:bookId', require('./endpoints/books/get-book/get-book'));
router.patch('/books/:bookId', require('./endpoints/books/update-book/update-book'));

router.get('/authors', require('./endpoints/authors/get-authors/get-authors'));
router.get('/authors/:authorId', require('./endpoints/authors/get-author/get-author'));
router.post('/authors/new', require('./endpoints/authors/create-author/create-author'));
router.patch('/authors/:authorId', require('./endpoints/authors/update-author/update-author'));

router.get('/book-alternatives/:bookAlternativeId', require('./endpoints/book-alternatives/get-book-alternative/get-book-alternative'));
router.post('/book-alternatives/new', require('./endpoints/book-alternatives/create-book-alternative/create-book-alternative'));
router.patch('/book-alternatives/:bookAlternativeId', require('./endpoints/book-alternatives/update-book-alternative/update-book-alternative'));

module.exports = router;
