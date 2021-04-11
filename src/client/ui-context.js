'use strict';

const React = require('react');

const UserInterface = React.createContext({ user: {}, changeUIData: () => {return;} });

module.exports = UserInterface;
