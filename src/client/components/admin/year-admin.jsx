'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

function YearAdmin() {
  const { year } = useParams();
  return (
    <div>
      <p>{ year } admin oldal</p>
    </div>
  );
}

module.exports = YearAdmin;
