'use strict';

window.process = { env: { NODE_ENV:'' } }; //fixes a bug in @material-ui/data-grid

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./app');

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
