'use strict';

const { createMuiTheme, colors } = require('@material-ui/core');

const theme = createMuiTheme({
  palette: {
    background: {
      dark: colors.blueGrey[50],
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: colors.blue,
    secondary: colors.blue,
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'sans-serif',
    ].join(','),
  }
});

module.exports = theme;
