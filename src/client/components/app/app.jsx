'use strict';

const React = require('react');
const { Switch, Route } = require('react-router-dom');

const AppHeader = require('./navigation/app-header');
const Sidebar = require('./navigation/sidebar');
const Admin = require('../admin/admin');
const YearAdmin = require('../admin/year-admin');
const Books = require('../books/books');

function App() {
  return (
    <div id="app-div">
      <AppHeader/>
      <div id="sidebar-container">
        <Sidebar/>
      </div>
      <main>
        <Switch>
          <Route path="/admin" component={ Admin }/>
          <Route path="/:year/admin" component={ YearAdmin }/>
          <Route path="/:year/:genre" component={ Books }/>
        </Switch>
      </main>
    </div>
  );
}

module.exports = App;
