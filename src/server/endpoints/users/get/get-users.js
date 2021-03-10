'use strict';

const { getUsersWithProps } = require('../../../dao/users/users');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    if (userData.role !== 'admin') {
      return res.sendStatus(401);
    }

    const users = await getUsersWithProps();

    return res.status(200).send(users);

  } catch (error) {
    res.sendStatus(500);
  }
};

