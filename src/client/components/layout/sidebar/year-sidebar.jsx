'use strict';

const React = require('react');
const classNames = require('classnames');
const { makeStyles } = require('@material-ui/core');
const { Link } = require('react-router-dom');

const useStyles = (drawerWidth) => makeStyles((theme) => ({
  yearSidebar: {
    display: 'flex',
    'flex-direction': 'column'
  },
  sidebarButton: {
    padding: '5px',
    cursor: 'pointer',
    
    '&:hover': {
      background: '#ffb1d8',
      borderRadius: '5px'
    }
  }
}))();

function YearSidebar({ year, drawerWidth }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const classes = useStyles(drawerWidth);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={ classes.yearSidebar }>
      <p className={ classNames('larger-font', classes.sidebarButton) } onClick={ handleClick }>{ year }</p>
      { isOpen && (<Link to={`${year}/scifi/list`} className={ classNames('indent', classes.sidebarButton) }>Sci-fi</Link>) }
      { isOpen && (<Link to={`${year}/fantasy/list`} className={ classNames('indent', classes.sidebarButton) }>Fantasy</Link>) }
      { isOpen && (<Link to={`${year}/admin`} className={ classNames('indent', classes.sidebarButton) }>Admin</Link>) }
    </div>
  );
}

module.exports = YearSidebar;
