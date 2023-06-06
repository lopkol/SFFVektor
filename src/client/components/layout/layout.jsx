'use strict';

const React = require('react');
const classNames = require('classnames');

const { Outlet } = require('react-router-dom');
const { styled } = require('@mui/material/styles');

const Topbar = require('./topbar/topbar');
const Sidebar = require('./sidebar/sidebar');

const drawerWidth = 160;

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: '0',
  '&.shifted': {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: `${drawerWidth}px`
  }
}));

const MainContent = styled('main')(({ theme }) => ({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  padding: theme.spacing(3)
}));

function Layout() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        drawerWidth={drawerWidth}
      />
      <Topbar
        isSidebarOpen={isSidebarOpen}
        onSidebarOpen={() => setSidebarOpen(true)}
        drawerWidth={drawerWidth}
      />
      <ContentContainer className={classNames({ shifted: isSidebarOpen })}>
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentContainer>
    </div>
  );
}

module.exports = Layout;
