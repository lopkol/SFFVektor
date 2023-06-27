'use strict';

module.exports = theme => ({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  html: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    minHeight: '100%',
    width: '100%'
  },
  body: {
    backgroundColor: '#f4f6f8',
    height: '100%',
    width: '100%',
    fontFamily: 'Montserrat',
    color: theme.palette.text.primary
  },
  main: {
    padding: '10px',
    height: '100%',
    width: '100%'
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
});
