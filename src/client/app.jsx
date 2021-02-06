'use strict';

const React = require('react');

const Button = require('@material-ui/core/Button').default;
const UserList = require('./components/user-list');

const title = 'Incredibly awesome!!!';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsers: false
    };
    this.toggleShowUsers = this.toggleShowUsers.bind(this);
  }

  toggleShowUsers() {
    const currentState = this.state.showUsers;
    this.setState({
      showUsers: !currentState
    });
  }
  render () {
    const buttonText = this.state.showUsers ? 'Hide user list' : 'Show user list';
    return (
      <div>
        <h1>{ title }</h1>
        <Button variant="contained" color="primary" onClick={ this.toggleShowUsers }>
          { buttonText }
        </Button>
        { this.state.showUsers && <UserList /> }
      </div>
    );
  }
}

module.exports = App;
