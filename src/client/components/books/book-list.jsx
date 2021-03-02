'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

function BookList() {
  const { genre, year } = useParams();
  return (
    <div>
      <p>itt lesz a {year} évi {genre} könyvlista</p>
    </div>
  );
}

module.exports = BookList;
