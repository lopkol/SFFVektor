'use strict';

const React = require('react');
const { Drawer, Divider, IconButton, makeStyles } = require('@material-ui/core');
const { ChevronLeft: ChevronLeftIcon, Settings: SettingsIcon } = require('@material-ui/icons');

const UserInterface = require('../../../lib/ui-context');
const YearSidebar = require('./year-sidebar');
const NavItem = require('./nav-item');

const useStyles = drawerWidth =>
  makeStyles(theme => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end'
    }
  }))();

function Sidebar({ isOpen, onClose, drawerWidth }) {
  const classes = useStyles(drawerWidth);

  const { user, bookLists } = React.useContext(UserInterface);
  const years = bookLists.map(bookList => bookList.year).filter((value, index, self) => self.indexOf(value) === index);

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isOpen}
      onClose={onClose}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      {user.role === 'admin' && <NavItem href={'/admin'} title="Admin" icon={SettingsIcon} />}
      {years.map((year, index) => (
        <YearSidebar key={year} year={year} drawerWidth={drawerWidth} openOnLoad={index === 0} />
      ))}
    </Drawer>
  );
}

module.exports = Sidebar;
