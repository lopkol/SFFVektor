'use strict';

const React = require('react');
const { NavLink } = require('react-router-dom');
const { Button, ListItem } = require('@mui/material');
const { styled } = require('@mui/material/styles');

const NavButton = styled(Button)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  justifyContent: 'flex-start',
  padding: '10px 8px',
  textTransform: 'none',
  width: '100%',
  '& .nav-button-icon': {
    marginRight: theme.spacing(1),
    fontSize: '24px'
  },
  '&.indented': { paddingLeft: theme.spacing(2) },
  '&.largerFont': { fontSize: 'larger' },
  '&.active': {
    '& .nav-button-title': {
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.dark
    },
    '& .nav-button-icon': {
      color: theme.palette.primary.dark
    }
  }
}));

const NavItem = ({ indented, className, href, icon: Icon, title, ...otherProps }) => {
  return (
    <ListItem
      sx={{ display: 'flex', paddingTop: 0, paddingBottom: 0 }}
      className={className}
      disableGutters
      {...otherProps}
    >
      <NavButton className={indented ? 'indented' : 'largerFont'} component={NavLink} to={href}>
        {Icon && <Icon className="nav-button-icon" />}
        <span className="nav-button-title" style={{ marginRight: 'auto' }}>
          {title}
        </span>
      </NavButton>
    </ListItem>
  );
};

module.exports = NavItem;
