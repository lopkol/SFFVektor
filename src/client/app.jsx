'use strict';

const React = require('react');

const { Routes, Route } = require('react-router-dom');

const AppHeader = require('./components/layout/app-header');
const Sidebar = require('./components/layout/sidebar/sidebar');
const Admin = require('./components/admin/admin');
const YearAdmin = require('./components/admin/year-admin');
const Books = require('./components/books/books');

function App() {
  return (
    <div id="app-div">
      <AppHeader/>
      <div id="sidebar-container">
        <Sidebar/>
      </div>
      <main>
        <Routes>
          <Route path="/admin" element={ <Admin /> }/>
          <Route path="/:year/admin" element={ <YearAdmin /> }/>
          <Route path="/:year/:genre/*" element={ <Books /> }/>
        </Routes>
      </main>
    </div>
  );
}

module.exports = App;
