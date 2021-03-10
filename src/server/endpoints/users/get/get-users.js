'use strict';

const { getUsersWithProps } = require('../../../dao/users/users');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    if (userData.role !== 'admin') {
      res.sendStatus(401);
      return;
    }

    const users = await getUsersWithProps();

    return res.status(200).send(users);

  } catch (error) {
    res.sendStatus(500);
  }
};

