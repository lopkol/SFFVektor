'use strict';

const React = require('react');
const { Navigate } = require('react-router-dom');

const NotFound = require('./components/common/not-found');
const Layout = require('./components/layout/layout');
const UserManagement = require('./components/admin/user-management');
const BookListManagement = require('./components/admin/book-list-management');
const YearBooks = require('./components/books/admin/year-books');
const BookList = require('./components/books/book-list-views/book-list');
const BookReading = require('./components/books/book-list-views/book-reading');
const BookTable = require('./components/books/book-list-views/book-table');
const BookListAdmin = require('./components/books/admin/book-list-admin');

const adminRoutes = [
  { path: '/', element: <Layout /> },
  { path: 'admin', element: <Layout />, children: [
    { path: '/', element: <Navigate to="users" /> },
    { path: 'users', element: <UserManagement /> },
    { path: 'book-lists', element: <BookListManagement /> }
  ] },
  { path: 'books/:year', element: <Layout />, children: [
    { path: '/', element: <YearBooks /> }
  ] },
  { path: 'book-lists/:year/:genre', element: <Layout />, children: [
    { path: '/', element: <Navigate to="list" /> },
    { path: 'list', element: <BookList /> },
    { path: 'reading', element: <BookReading /> },
    { path: 'table', element: <BookTable /> },
    { path: 'admin', element: <BookListAdmin /> }
  ] },
  { path: 'home', element: <Navigate to="/" /> },
  { path: '*', element: <NotFound /> }
];

const routes = [
  { path: '/', element: <Layout /> },
  { path: 'book-lists/:year/:genre', element: <Layout />,  children: [
    { path: '/', element: <Navigate to="list" /> },
    { path: 'list', element: <BookList /> },
    { path: 'reading', element: <BookReading /> },
    { path: 'table', element: <BookTable /> }
  ] },
  { path: 'home', element: <Navigate to="/" /> },
  { path: '*', element: <NotFound /> }
];

module.exports = {
  routes,
  adminRoutes
};
