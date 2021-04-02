'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

function YearBooks() {
  const { year } = useParams();
  return (
    <div>
      <p>{ year } admin oldal - itt lehet majd szerkeszteni a könyveket</p>
    </div>
  );
}

module.exports = YearBooks;
