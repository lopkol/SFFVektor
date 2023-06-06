'use strict';

const React = require('react');
const { Drawer, Divider, IconButton } = require('@mui/material');
const { styled } = require('@mui/material/styles');
const { ChevronLeft: ChevronLeftIcon, Settings: SettingsIcon } = require('@mui/icons-material');

const UserInterface = require('../../../lib/ui-context');
const YearSidebar = require('./year-sidebar');
const NavItem = require('./nav-item');

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

function Sidebar({ isOpen, onClose, drawerWidth }) {
  const { user, bookLists } = React.useContext(UserInterface);
  const years = bookLists
    .map(bookList => bookList.year)
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <Drawer
      sx={{ flexShrink: 0, width: drawerWidth + 'px' }}
      variant="persistent"
      anchor="left"
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { width: drawerWidth + 'px' } }}
    >
      <DrawerHeader>
        <IconButton onClick={onClose} size="large">
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      {user.role === 'admin' && <NavItem href={'/admin'} title="Admin" icon={SettingsIcon} />}
      {years.map((year, index) => (
        <YearSidebar key={year} year={year} drawerWidth={drawerWidth} openOnLoad={index === 0} />
      ))}
    </Drawer>
  );
}

module.exports = Sidebar;
