'use strict';

const React = require('react');

const UserInterface = React.createContext({ user: {}, bookLists: [], changeUIData: () => {return;} });

module.exports = UserInterface;
