'use strict';

const React = require('react');
const UserList = require('./user-list');

function Admin() {
  return (
    <div>
      <p>általános admin oldal</p>
      <UserList/>
    </div>
  );
}

module.exports = Admin;
