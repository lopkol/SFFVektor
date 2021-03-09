'use strict';

const React = require('react');
const DocumentTitle = require('react-document-title');
const { Switch, Route } = require('react-router-dom');
const { getJwtToken } = require('../../services/jwt');
const { setApiCookie } = require('../../services/api');

const AppHeader = require('./navigation/app-header');
const Sidebar = require('./navigation/sidebar');
const Admin = require('../admin/admin');
const YearAdmin = require('../admin/year-admin');
const Books = require('../books/books');

function App() {
  React.useEffect(() => {
    const jwt = getJwtToken();
    setApiCookie(jwt);
  }, []);

  return (
    <DocumentTitle title="SFFVektor">
      <div>
        <AppHeader/>
        <Sidebar/>
        <main>
          <Switch>
            <Route path="/admin" component={ Admin }/>
            <Route path="/:year/admin" component={ YearAdmin }/>
            <Route path="/:year/:genre" component={ Books }/>
          </Switch>
        </main>
      </div>
    </DocumentTitle>
  );
}

module.exports = App;
