'use strict';

const React = require('react');
const { Link } = require('react-router-dom');
const { Typography, Button } = require('@mui/material');
const { makeStyles } = require('@mui/styles');

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(5),
    alignItems: 'center'
  }
}));

function NotFound() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h5" sx={{ marginBottom: 4 }}>
        A keresett oldal nem található
      </Typography>
      <Button variant="contained" component={Link} to="/" color="primary">
        Vissza a kezdőlapra
      </Button>
    </div>
  );
}

module.exports = NotFound;
