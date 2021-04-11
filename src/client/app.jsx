'use strict';

const React = require('react');
const { Navigate, useRoutes } = require('react-router-dom');
const { ThemeProvider } = require('@material-ui/core');

const GlobalStyles = require('./components/styles/global-styles');
const theme = require('./components/styles/theme');

const { getOwnData } = require('./services/api/users/users');
//const { getBookLists } = require('./services/api/book-lists/book-lists');
const UserInterface = require('./ui-context');

const NotFound = require('./components/common/not-found');
const Layout = require('./components/layout/layout');
const UserManagement = require('./components/admin/user-management');
const BookListManagement = require('./components/admin/book-list-management');
const YearBooks = require('./components/books/admin/year-books');
const BookList = require('./components/books/book-list-views/book-list');
const BookReading = require('./components/books/book-list-views/book-reading');
const BookTable = require('./components/books/book-list-views/book-table');
const BookListAdmin = require('./components/books/admin/book-list-admin');

function App() {
  const [user, setUser] = React.useState({});
  //const [bookLists, setBookLists] = React.useState([]);
  const [reload, setReload] = React.useState(false);

  React.useEffect(async () => {
    const ownUserData = await getOwnData();
    setUser(ownUserData);

    //const allBookLists = await getBookLists();
    //setBookLists(allBookLists);
    setReload(false);
  }, [reload]);

  const adminRoutes = [
    { path: '/', element: <Layout /> },
    { path: 'admin', element: <Layout />, children: [
      { path: '/', element: <Navigate to="users" /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'book-lists', element: <BookListManagement /> }
    ] },
    { path: ':year/books', element: <Layout />, children: [
      { path: '/', element: <YearBooks /> }
    ] },
    { path: ':year/:genre', element: <Layout />, children: [
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
    { path: ':year/books', element: <NotFound /> },
    { path: ':year/:genre', element: <Layout />,  children: [
      { path: '/', element: <Navigate to="list" /> },
      { path: 'list', element: <BookList /> },
      { path: 'reading', element: <BookReading /> },
      { path: 'table', element: <BookTable /> }
    ] },
    { path: 'home', element: <Navigate to="/" /> },
    { path: '*', element: <NotFound /> }
  ];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <UserInterface.Provider value={{ user, changeUIData: () => setReload(true) }}>
        { user.role === 'admin' ? useRoutes(adminRoutes) : useRoutes(routes) }
      </UserInterface.Provider>
    </ThemeProvider>
  );
}

module.exports = App;
