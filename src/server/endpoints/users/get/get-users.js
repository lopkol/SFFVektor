'use strict';

const { getUsersWithProps } = require('../../../dao/users/users');
const { canManageUsers } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canSeeUserList = await canManageUsers(userData.id);
    if (!canSeeUserList) {
      return res.sendStatus(403);
    }

    const users = await getUsersWithProps();

    return res.status(200).send(users);

  } catch (error) {
    res.sendStatus(500);
  }
};
