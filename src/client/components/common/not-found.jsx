'use strict';

const React = require('react');
const { Link } = require('react-router-dom');
const { Typography, Button, makeStyles } = require('@material-ui/core');

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(5),
    alignItems: 'center'
  },
  title: {
    marginBottom: theme.spacing(4)
  }
}));

function NotFound() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        A keresett oldal nem található
      </Typography>
      <Button variant="contained" component={Link} to="/" color="primary">
        Vissza a kezdőlapra
      </Button>
    </div>
  );
}

module.exports = NotFound;
