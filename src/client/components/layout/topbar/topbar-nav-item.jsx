'use strict';

const React = require('react');
const { NavLink } = require('react-router-dom');
const { Button, Hidden, IconButton, Tooltip } = require('@mui/material');
const { styled } = require('@mui/material/styles');

const getButtonStyle = ({ theme, isActive }) => ({
  '& .title': {
    marginLeft: theme.spacing(1),
    fontWeight: isActive ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
    color: isActive ? theme.palette.primary.light : theme.palette.common.white
  },
  '& .icon': {
    color: isActive ? theme.palette.primary.light : theme.palette.common.white
  }
});

const NavButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginLeft: theme.spacing(1),
  padding: theme.spacing(1),
  textTransform: 'none',
  ...getButtonStyle({ theme, isActive: false }),
  '&.active': getButtonStyle({ theme, isActive: true })
}));

const NavIconButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(1),
  ...getButtonStyle({ theme, isActive: false }),
  '&.active': getButtonStyle({ theme, isActive: true })
}));

const TopbarNavItem = ({ className, to, icon: Icon, title, ...rest }) => {
  return (
    <div>
      <Hidden mdDown>
        <NavButton className={className} component={NavLink} to={to} {...rest}>
          {Icon && (
            <Icon
              className="icon"
              style={{
                fontSize: '24'
              }}
            />
          )}
          <span className="title">{title}</span>
        </NavButton>
      </Hidden>
      <Hidden mdUp>
        <Tooltip title={<p style={{ fontSize: '16px' }}>{title}</p>}>
          <NavIconButton component={NavLink} to={to} color="inherit" size="large">
            <Icon style={{ fontSize: '24px' }} className="icon" />
          </NavIconButton>
        </Tooltip>
      </Hidden>
    </div>
  );
};

module.exports = TopbarNavItem;
