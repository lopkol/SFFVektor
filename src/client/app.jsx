'use strict';

const React = require('react');
const { useRoutes } = require('react-router-dom');
const { StyledEngineProvider, ThemeProvider } = require('@mui/material/styles');
const { GlobalStyles } = require('@mui/material');

const globalStyles = require('./styles/global-styles');
const theme = require('./styles/theme');

const { getOwnData } = require('./services/api/users/users');
const { getBookLists } = require('./services/api/book-lists/book-lists');
const UserInterface = require('./lib/ui-context');
const { routes, adminRoutes } = require('./routes');

const { sortBookLists } = require('./lib/useful-stuff');

function App() {
  const [user, setUser] = React.useState({});
  const [bookLists, setBookLists] = React.useState([]);
  const [reload, setReload] = React.useState(true);

  React.useEffect(() => {
    if (reload) {
      (async () => {
        setUser(await getOwnData());

        const allBookLists = await getBookLists();
        setBookLists(sortBookLists(allBookLists));
      })();

      setReload(false);
    }
  }, [reload]);

  const adminRouter = useRoutes(adminRoutes);
  const router = useRoutes(routes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={globalStyles} />
        <UserInterface.Provider value={{ user, bookLists, changeUIData: () => setReload(true) }}>
          {user.role === 'admin' ? adminRouter : router}
        </UserInterface.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

module.exports = App;
