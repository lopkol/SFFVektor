'use strict';

const { getUsersWithProps } = require('../../dao/user/user');

module.exports = async (req, res) => {
  try {
    const users = await getUsersWithProps();

    return res.status(200).send(users);
    
  } catch (error) {
    res.sendStatus(500);
  }
};

