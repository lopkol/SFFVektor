'use strict';

const React = require('react');
const { Routes, Route, useParams } = require('react-router-dom');
const BooksNavbar = require('./books-navbar');
const BookList = require('./book-views/book-list');
const BookReadings = require('./book-views/book-readings');
const BookTable = require('./book-views/book-table');

function Books() {
  const { genre, year } = useParams();

  return (
    <div>
      <BooksNavbar year={ year } genre={ genre }/>
      <div id="books-content">
        <Routes>
          <Route path='list' element={ <BookList year={ year } genre={ genre } key={ year + genre + '-list' }/> } />
          <Route path='reading' element={ <BookReadings year={ year } genre={ genre } key={ year + genre + '-reading' }/> } />
          <Route path='table' element={ <BookTable year={ year } genre={ genre } key={ year + genre + '-table' }/> } />
        </Routes>
      </div>
    </div>
  );
}

module.exports = Books;
