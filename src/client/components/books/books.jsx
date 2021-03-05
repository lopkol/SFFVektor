'use strict';

const React = require('react');
const { Switch, Route, useParams, useRouteMatch } = require('react-router-dom');
const BooksNavbar = require('./books-navbar');
const BookList = require('./book-views/book-list');
const BookReadings = require('./book-views/book-readings');
const BookTable = require('./book-views/book-table');

function Books() {
  const { genre, year } = useParams();
  let match = useRouteMatch();

  return (
    <div>
      <BooksNavbar year={ year } genre={ genre }/>
      <div id="books-content">
        <Switch>
          <Route path={`${match.path}/list`}>
            <BookList year={ year } genre={ genre }/>
          </Route>
          <Route path={`${match.path}/reading`}>
            <BookReadings year={ year } genre={ genre }/>
          </Route>
          <Route path={`${match.path}/table`}>
            <BookTable year={ year } genre={ genre }/>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

module.exports = Books;
