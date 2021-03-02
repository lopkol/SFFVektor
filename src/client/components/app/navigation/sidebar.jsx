'use strict';

const React = require('react');
const { Link } = require('react-router-dom');
const YearSidebar = require('./year-sidebar');

function Sidebar() {
  const years = [2019, 2020, 2021];
  return (
    <nav id="sidebar">
      <Link to="/admin" className="sidebar-button larger-font">Admin</Link>
      { years.map(year => <YearSidebar key={ year } year={ year }/>) }
    </nav>
  );
}

module.exports = Sidebar;
