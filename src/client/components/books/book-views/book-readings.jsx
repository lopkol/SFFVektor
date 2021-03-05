'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

function BookReadings() {
  const { genre, year } = useParams();

  return (
    <div>
      <p>{ year } { genre } könyvek a felhasználó olvasásai szerint rendezve</p>
    </div>
  );
}

module.exports = BookReadings;
