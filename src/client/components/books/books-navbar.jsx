'use strict';

const React = require('react');
const { NavLink, useRouteMatch } = require('react-router-dom');

function BooksNavbar({ genre, year }) {
  let match = useRouteMatch();

  return (
    <div>
      <h2 className="center">{ year } { genre } jelöltlista</h2>
      <nav id="top-navbar">
        <NavLink 
          to={`${match.url}/list`} 
          className="top-navbar-button" 
          activeClassName="active-top-navbar-button">
            Lista
        </NavLink>
        <NavLink 
          to={`${match.url}/reading`} 
          className="top-navbar-button" 
          activeClassName="active-top-navbar-button">
            Olvasás szerint
        </NavLink>
        <NavLink 
          to={`${match.url}/table`} 
          className="top-navbar-button" 
          activeClassName="active-top-navbar-button">
            Táblázat
        </NavLink>
      </nav>
    </div>
  );
}

module.exports = BooksNavbar;
