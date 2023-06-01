'use strict';

window.process = { env: { NODE_ENV: '' } }; //fixes a bug in @material-ui/data-grid

const React = require('react');
const ReactDOM = require('react-dom');
const { BrowserRouter } = require('react-router-dom');
const App = require('./app');
require('./style.scss');

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('app')
);
