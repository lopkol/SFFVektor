'use strict';

const React = require('react');
const classNames = require('classnames');

const { Link } = require('react-router-dom');
const { Drawer, Divider, IconButton, makeStyles } = require('@material-ui/core');
const { ChevronLeft: ChevronLeftIcon } = require('@material-ui/icons');
const YearSidebar = require('./year-sidebar');

const useStyles = (drawerWidth) => makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
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

function Sidebar({ isOpen, onClose, drawerWidth }) {
  const years = [2020, 2019];
  const classes = useStyles(drawerWidth);

  return (
    <Drawer
      className={ classes.drawer }
      variant="persistent"
      anchor="left"
      open={ isOpen }
      onClose={ onClose }
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={ onClose }>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <Link to="/admin" className={ classNames('larger-font', classes.sidebarButton) }>Admin</Link>
      { years.map(year => <YearSidebar key={ year } year={ year } drawerWidth={ drawerWidth } />) }
    </Drawer>
  );
}

module.exports = Sidebar;
