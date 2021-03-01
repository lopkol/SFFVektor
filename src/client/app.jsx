'use strict';

const React = require('react');

const Button = require('@material-ui/core/Button').default;
const UserList = require('./components/user-list');

const title = 'Incredibly awesome!!!';

function App() {
  const [showUsers, setShowUsers] = React.useState(false);

  const toggleShowUsers = () => {
    const currentState = showUsers;
    setShowUsers(!currentState);
  };

  const buttonText = showUsers ? 'Hide user list' : 'Show user list';
  return (
    <div>
      <h1>{ title }</h1>
      <Button variant="contained" color="primary" onClick={ toggleShowUsers }>
        { buttonText }
      </Button>
      { showUsers && <UserList /> }
    </div>
  );
}

module.exports = App;
