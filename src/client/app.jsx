'use strict';

const React = require('react');
const { useRoutes } = require('react-router-dom');
const { ThemeProvider } = require('@material-ui/core');

const GlobalStyles = require('./components/styles/global-styles');
const theme = require('./components/styles/theme');

const Layout = require('./components/layout/layout');
const Admin = require('./components/admin/admin');
const YearAdmin = require('./components/admin/year-admin');
const BookList = require('./components/books/book-views/book-list');
const BookReadings = require('./components/books/book-views/book-readings');
const BookTable = require('./components/books/book-views/book-table');

const routes = [
  { path: '/', element: <Layout /> },
  { path: 'admin', element: <Layout />, children: [
    { path: '/', element: <Admin /> }
  ] },
  { path: ':year/admin', element: <Layout />, children: [
    { path: '/', element: <YearAdmin /> }
  ] },
  { path: ':year/:genre', element: <Layout />, children: [
    { path: 'list', element: <BookList /> },
    { path: 'reading', element: <BookReadings /> },
    { path: 'table', element: <BookTable /> }
  ] },
  //{ path: 'home', redirectTo: '/' },
  //{ path: '*', element: <NotFound /> }
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
