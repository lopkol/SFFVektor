'use strict';

const { createStyles, makeStyles } = require('@material-ui/core');

const useStyles = makeStyles(() => createStyles({
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
      'font-family': 'Alegreya',
      color: '#04003d'
    },
    main: {
      padding: '10px',
      height: '100%',
      width: '100%'
    },
    'h1, h2, h3, h4, h5': {
      margin: '5px',
      'font-family': 'Lora'
    },
    a: {
      textDecoration: 'none',
      '&:link, &:visited, &:hover': {
        color: '#04003d'
      },
      '&:active': {
        color: '#FF007F'
      }
    },
    '#app': {
      height: '100%',
      width: '100%'
    },
    '.larger-font': {
      'font-size': 'larger'
    },
    '.indent': {
      'margin-left': '10px'
    },
    '.center': {
      'text-align': 'center'
    }
  }
}));

function GlobalStyles() {
  useStyles();

  return null;
}

module.exports = GlobalStyles;
