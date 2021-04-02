'use strict';

const React = require('react');
const { useRoutes } = require('react-router-dom');
const { ThemeProvider } = require('@material-ui/core');

const GlobalStyles = require('./components/styles/global-styles');
const theme = require('./components/styles/theme');

const Redirect = require('./components/common/redirect');
const NotFound = require('./components/common/not-found');
const Layout = require('./components/layout/layout');
const UserManagement = require('./components/admin/user-management');
const BookListManagement = require('./components/admin/book-list-management');
const YearBooks = require('./components/books/admin/year-books');
const BookList = require('./components/books/book-list-views/book-list');
const BookReading = require('./components/books/book-list-views/book-reading');
const BookTable = require('./components/books/book-list-views/book-table');
const BookListAdmin = require('./components/books/admin/book-list-admin');

const routes = [
  { path: '/', element: <Layout /> },
  { path: 'admin', element: <Layout />, children: [
    { path: '/', element: <Redirect to="users" /> },
    { path: 'users', element: <UserManagement /> },
    { path: 'book-lists', element: <BookListManagement /> }
  ] },
  { path: ':year/books', element: <Layout />, children: [
    { path: '/', element: <YearBooks /> }
  ] },
  { path: ':year/:genre', element: <Layout />, children: [
    { path: '/', element: <Redirect to="list" /> },
    { path: 'list', element: <BookList /> },
    { path: 'reading', element: <BookReading /> },
    { path: 'table', element: <BookTable /> },
    { path: 'admin', element: <BookListAdmin /> }
  ] },
  { path: 'home', element: <Redirect to="/" /> },
  { path: '*', element: <NotFound /> }
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      { useRoutes(routes) }
    </ThemeProvider>
  );
}

module.exports = App;
