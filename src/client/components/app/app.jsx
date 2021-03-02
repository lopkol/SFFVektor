'use strict';

const React = require('react');
const DocumentTitle = require('react-document-title');
const { Switch, Route } = require('react-router-dom');

const AppHeader = require('./navigation/app-header');
const Sidebar = require('./navigation/sidebar');
const Admin = require('../admin/admin');
const YearAdmin = require('../admin/year-admin');
const BookList = require('../books/book-list');

function App() {

  return (
    <DocumentTitle title="SFFVektor">
      <div>
        <AppHeader/>
        <Sidebar/>
        <main>
          <Switch>
            <Route exact path="/admin" component={ Admin }/>
            <Route exact path="/:year/admin" component={ YearAdmin }/>
            <Route exact path="/:year/:genre" component={ BookList }/>
          </Switch>
        </main>
      </div>
    </DocumentTitle>
  );
}

module.exports = App;
