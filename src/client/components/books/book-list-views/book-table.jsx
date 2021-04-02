'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

function BookTable() {
  const { genre, year } = useParams();

  return (
    <div>
      <p>{ year } { genre } olvasások táblázatban</p>
    </div>
  );
}

module.exports = BookTable;
