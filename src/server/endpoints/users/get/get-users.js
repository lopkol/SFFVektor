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

    const properties = req.body.userData || {};

    const users = await getUsersWithProps(properties);

    return res.status(200).send(users);

  } catch (error) {
    res.sendStatus(500);
  }
};
