'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('@material-ui/core/Button').default;

const title = 'Incredibly awesome!!!';

function App() {
  return (
    <div>
      <h1>{ title }</h1>
      <Button variant="contained" color="primary">
        Infinite beer
      </Button>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
