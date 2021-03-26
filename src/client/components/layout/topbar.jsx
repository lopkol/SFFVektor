'use strict';

const React = require('react');
const classNames = require('classnames');
const { Link } = require('react-router-dom');
const { AppBar, Toolbar, IconButton, Box, makeStyles } = require('@material-ui/core');

const { Menu: MenuIcon } = require('@material-ui/icons');
const SffVektorIcon = require('../styles/sff-vektor-icon');

const useStyles = (drawerWidth) => makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(75deg, #0b3f69, #000010)'
  },
  appBar: {
    background: 'linear-gradient(75deg, #0b3f69, #000010)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  }
}))();

function Topbar({ isSidebarOpen, onSidebarOpen, drawerWidth }) {
  const classes = useStyles(drawerWidth);

  return (
    <AppBar 
      position="sticky" 
      className={ classNames(classes.appBar, {
        [classes.appBarShift]: isSidebarOpen
      }) }
    >
      <Toolbar>
        <IconButton 
          onClick={ onSidebarOpen } 
          color="inherit"
          className={ classNames(classes.menuButton, isSidebarOpen && classes.hide ) }
        >
          <MenuIcon size={30}/>
        </IconButton> 
        <Box flexGrow={1} /> 
        <IconButton color="inherit" component={Link} to={'/'}>
          <SffVektorIcon color="#23bedb" size={30}/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

module.exports = Topbar;
