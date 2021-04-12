'use strict';

const React = require('react');
const { useRoutes } = require('react-router-dom');
const { ThemeProvider } = require('@material-ui/core');

const GlobalStyles = require('./components/styles/global-styles');
const theme = require('./components/styles/theme');

const { getOwnData } = require('./services/api/users/users');
const { getBookLists } = require('./services/api/book-lists/book-lists');
const UserInterface = require('./lib/ui-context');
const { routes, adminRoutes } = require('./routes');

const { sortBookLists } = require('./lib/useful-stuff');

function App() {
  const [user, setUser] = React.useState({});
  const [bookLists, setBookLists] = React.useState([]);
  const [reload, setReload] = React.useState(true);

  React.useEffect(async () => {
    if (reload) {
      setUser(await getOwnData());

      const allBookLists = await getBookLists();
      setBookLists(sortBookLists(allBookLists));

      setReload(false);
    }
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
