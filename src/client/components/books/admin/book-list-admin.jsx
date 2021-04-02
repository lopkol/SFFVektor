'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

function BookListAdmin() {
  const { year, genre } = useParams();
  return (
    <div>
      <p>{ year } { genre } könyvlista szerkesztése</p>
    </div>
  );
}

module.exports = BookListAdmin;
