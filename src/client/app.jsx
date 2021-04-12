'use strict';

const React = require('react');
const { useRoutes } = require('react-router-dom');
const { ThemeProvider } = require('@material-ui/core');

const GlobalStyles = require('./components/styles/global-styles');
const theme = require('./components/styles/theme');

const { getOwnData } = require('./services/api/users/users');
const { getBookLists } = require('./services/api/book-lists/book-lists');
const UserInterface = require('./ui-context');
const { routes, adminRoutes } = require('./routes');

function App() {
  const [user, setUser] = React.useState({});
  const [bookLists, setBookLists] = React.useState([]);
  const [reload, setReload] = React.useState(false);

  React.useEffect(async () => {
    const ownUserData = await getOwnData();
    setUser(ownUserData);

    const allBookLists = await getBookLists();
    setBookLists(allBookLists);

    setReload(false);
  }, [reload]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <UserInterface.Provider value={{ user, bookLists, changeUIData: () => setReload(true) }}>
        { user.role === 'admin' ? useRoutes(adminRoutes) : useRoutes(routes) }
      </UserInterface.Provider>
    </ThemeProvider>
  );
}

module.exports = App;
