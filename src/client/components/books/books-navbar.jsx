'use strict';

const React = require('react');
const { NavLink } = require('react-router-dom');

function BooksNavbar({ genre, year }) {

  return (
    <div>
      <h2 className="center">{ year } { genre } jelöltlista</h2>
      <nav id="top-navbar">
        <NavLink 
          to="list"
          className="top-navbar-button" 
          activeClassName="active-top-navbar-button">
            Lista
        </NavLink>
        <NavLink 
          to="reading"
          className="top-navbar-button" 
          activeClassName="active-top-navbar-button">
            Olvasás szerint
        </NavLink>
        <NavLink 
          to="table" 
          className="top-navbar-button" 
          activeClassName="active-top-navbar-button">
            Táblázat
        </NavLink>
      </nav>
    </div>
  );
}

module.exports = BooksNavbar;
