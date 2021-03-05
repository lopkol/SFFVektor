'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

function BookList() {
  const { genre, year } = useParams();

  return (
    <div>
      <p>{ year } { genre } jelöltlista (a felhasználó olvasásaival)</p>
    </div>
  );
}

module.exports = BookList;
