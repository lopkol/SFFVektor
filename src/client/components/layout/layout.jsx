'use strict';

const React = require('react');
const classNames = require('classnames');

const { Outlet } = require('react-router-dom');
const { makeStyles } = require('@material-ui/core');

const Topbar = require('./topbar/topbar');
const Sidebar = require('./sidebar/sidebar');

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: '0'
  },
  contentContainerShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(3),
  }
}));


function Layout() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const classes = useStyles();

  return (
    <div className={ classes.root }>
      <Sidebar
        isOpen={ isSidebarOpen }
        onClose={ () => setSidebarOpen(false) }
        drawerWidth={ drawerWidth }
      />
      <Topbar
        isSidebarOpen={ isSidebarOpen }
        onSidebarOpen={ () => setSidebarOpen(true) }
        drawerWidth={ drawerWidth }
      />
      <div className={ classNames(classes.contentContainer, {
        [classes.contentContainerShift]: isSidebarOpen
      }) }>
        <main className={ classes.content }>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

module.exports = Layout;
