'use strict';

const React = require('react');
const classNames = require('classnames');
const { Link, useMatch, useParams } = require('react-router-dom');
const { 
  AppBar, 
  Box, 
  IconButton, 
  Toolbar, 
  Typography, 
  makeStyles 
} = require('@material-ui/core');
const UserInterface = require('../../../lib/ui-context');
const { getTitle, topNavbar } = require('./topbar-options');

const { Menu: MenuIcon } = require('@material-ui/icons');
const SffVektorIcon = require('../../styles/sff-vektor-icon');
const TopbarNavItem = require('./topbar-nav-item');

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
  menuButton: {
    marginRight: theme.spacing(1),
  },
  hide: {
    display: 'none',
  }
}))();

function Topbar({ isSidebarOpen, onSidebarOpen, drawerWidth }) {
  const classes = useStyles(drawerWidth);
  const { user } = React.useContext(UserInterface);
  const { bookListId, year } = useParams();

  const [adminPath, yearBooksPath, bookListPath] = [useMatch('/admin/*'), useMatch('/books/*'), useMatch('/book-lists/*')];
  let type = 'home';
  if (adminPath) {
    type = 'admin';
  } else if (yearBooksPath) {
    type = 'yearBooks';
  } else if (bookListPath) {
    type = 'bookList';
  }


  const title = getTitle(type, year, bookListId);
  let buttons = topNavbar.find(subpage => subpage.type === type).buttons;
  if (type === 'bookList' && user.role !== 'admin') {
    buttons = buttons.slice(0, 3);
  }

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
            <TopbarNavItem key={ button.id } title={ button.name } to={ button.to } icon={ button.icon }/>
          )) }
        </Box>
        <IconButton color="inherit" component={Link} to={'/'}>
          <SffVektorIcon color="white" size={30}/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

module.exports = Topbar;
