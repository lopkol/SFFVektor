'use strict';

const React = require('react');
const { NavLink } = require('react-router-dom');
const classNames = require('classnames');
const { Button, Hidden, IconButton, Tooltip } = require('@mui/material');
const { makeStyles } = require('@mui/styles');

const getActiveButtonStyle = theme => ({
  '& $title': {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.light
  },
  '& $icon': {
    color: theme.palette.primary.light
  }
});

const useStyles = makeStyles(theme => ({
  button: {
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: theme.spacing(1.5),
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    textTransform: 'none',
    '&.active': getActiveButtonStyle(theme)
  },
  icon: {
    color: theme.palette.common.white
  },
  iconButton: {
    margin: theme.spacing(1),
    '&.active': getActiveButtonStyle(theme)
  },
  title: {
    color: theme.palette.common.white,
    marginLeft: theme.spacing(1)
  }
}));

const TopbarNavItem = ({ className, to, icon: Icon, title, ...rest }) => {
  const classes = useStyles();

  return (
    <div>
      <Hidden mdDown>
        <Button
          className={classNames(classes.button, className)}
          component={NavLink}
          to={to}
          {...rest}
        >
          {Icon && (
            <Icon
              className={classes.icon}
              style={{
                fontSize: '24'
              }}
            />
          )}
          <span className={classes.title}>{title}</span>
        </Button>
      </Hidden>
      <Hidden mdUp>
        <Tooltip title={<p style={{ fontSize: '16px' }}>{title}</p>}>
          <IconButton
            component={NavLink}
            className={classes.iconButton}
            to={to}
            color="inherit"
            size="large"
          >
            <Icon style={{ fontSize: '24px' }} className={classes.icon} />
          </IconButton>
        </Tooltip>
      </Hidden>
    </div>
  );
};

module.exports = TopbarNavItem;
