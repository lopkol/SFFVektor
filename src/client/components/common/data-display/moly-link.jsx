'use strict';

const React = require('react');
const { makeStyles } = require('@material-ui/core');

const useStyles = makeStyles((theme) => ({
  molyLink: {
    display: 'inline-block',
    backgroundColor: '#cfdfef',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    color: '#2f5f8f',
    fontWeight: 700,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    }
  }
}));

function MolyLink({ url }) {
  const classes = useStyles();

  return (
    <a
      className={classes.molyLink}
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      m
    </a>
  );
}

module.exports = MolyLink;
