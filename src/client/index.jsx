'use strict';

const { createRoot } = require('react-dom/client');

const React = require('react');
const { BrowserRouter } = require('react-router-dom');
const App = require('./app');

const reactRoot = createRoot(document.getElementById('app'));
reactRoot.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
