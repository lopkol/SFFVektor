'use strict';

const React = require('react');
const classNames = require('classnames');
const { Link, useMatch, useParams } = require('react-router-dom');
const { 
  AppBar, 
  Box, 
  IconButton, 
  Toolbar, 
  Tooltip, 
  Typography, 
  makeStyles 
} = require('@material-ui/core');
const { getTitle, topNavbar } = require('./topbar-options');

const { Menu: MenuIcon } = require('@material-ui/icons');
const SffVektorIcon = require('../../styles/sff-vektor-icon');

const useStyles = (drawerWidth) => makeStyles((theme) => ({
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
  navContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    margin: theme.spacing(2),
  },
  navButton: {
    margin: theme.spacing(1)
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

  const { genre, year } = useParams();

  let type = 'home';
  if (useMatch('/admin/*')) {
    type = 'admin';
  } else if (useMatch(`/${year}/books/*`)) {
    type = 'yearBooks';
  } else if (useMatch(`/${year}/${genre}/*`)) {
    type = 'bookList';
  }

  const title = getTitle(type, year, genre);
  const buttons = topNavbar.find(subpage => subpage.type === type).buttons;

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
        <Box className={classes.navContainer}>
          <Typography
            align="center"
            className={classes.title}
            color="inherit"
            variant="h5"
          >
            { title }
          </Typography>
          { buttons.map(button => (
            <Tooltip title={ <p style={{ fontSize: '16px' }} >{ button.name }</p> } key={ button.id } className={classes.navButton}>
              <IconButton component={ Link } to={ button.to } color="inherit">
                <button.icon style={{ fontSize: '24px' }} color="white"/>
              </IconButton>
            </Tooltip>
          )) }
        </Box>
        <IconButton color="inherit" component={Link} to={'/'}>
          <SffVektorIcon color="#23bedb" size={30}/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

module.exports = Topbar;
