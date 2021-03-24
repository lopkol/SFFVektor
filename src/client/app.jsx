'use strict';

const React = require('react');
const { ThemeProvider } = require('@material-ui/core');

const GlobalStyles = require('./components/styles/global-styles');
const Layout = require('./components/layout/layout');
const theme = require('./components/styles/theme');

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Layout />
    </ThemeProvider>
  );
}

module.exports = App;
