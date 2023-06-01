'use strict';

const React = require('react');
const { NavLink } = require('react-router-dom');
const classNames = require('classnames');
const { Button, ListItem, makeStyles } = require('@material-ui/core');

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    '& $title': {
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.dark
    },
    '& $icon': {
      color: theme.palette.primary.dark
    }
  },
  indented: {
    paddingLeft: theme.spacing(2)
  },
  largerFont: {
    fontSize: 'larger'
  }
}));

const NavItem = ({ indented, className, href, icon: Icon, title, ...rest }) => {
  const classes = useStyles();

  return (
    <ListItem className={classNames(classes.item, className)} disableGutters {...rest}>
      <Button
        activeClassName={classes.active}
        className={classNames(classes.button, indented ? classes.indented : classes.largerFont)}
        component={NavLink}
        to={href}
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
    </ListItem>
  );
};

module.exports = NavItem;
