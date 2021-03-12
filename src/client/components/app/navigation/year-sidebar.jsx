'use strict';

const React = require('react');
const { Link } = require('react-router-dom');

function YearSidebar({ year }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="year-sidebar">
      <p className="sidebar-button larger-font" onClick={ handleClick }>{ year }</p>
      { isOpen && (<Link to={`/${year}/scifi/list`} className="sidebar-button indent">Sci-fi</Link>) }
      { isOpen && (<Link to={`/${year}/fantasy/list`} className="sidebar-button indent">Fantasy</Link>) }
      { isOpen && (<Link to={`/${year}/admin`} className="sidebar-button indent">Admin</Link>) }
    </div>
  );
}

module.exports = YearSidebar;
