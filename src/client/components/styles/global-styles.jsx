'use strict';

const { createStyles, makeStyles } = require('@material-ui/core');

const useStyles = makeStyles((theme) => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      'min-height': '100%',
      width: '100%'
    },
    body: {
      backgroundColor: '#f4f6f8',
      height: '100%',
      width: '100%',
      'font-family': 'Montserrat',
      color: theme.palette.text.primary
    },
    main: {
      padding: '10px',
      height: '100%',
      width: '100%'
    },
    'h1, h2, h3, h4, h5': {
      margin: '5px',
    },
    a: {
      textDecoration: 'none',
      '&:link, &:visited, &:hover': {
        color: theme.palette.text.primary
      },
      '&:active': {
        color: theme.palette.primary.main
      }
    },
    '#app': {
      height: '100%',
      width: '100%'
    }
  }
}));

function GlobalStyles() {
  useStyles();

  return null;
}

module.exports = GlobalStyles;
