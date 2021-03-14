'use strict';

const { createUser } = require('../../../dao/users/users');
const { canManageUsers } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canAddNewUsers = await canManageUsers(userData.id);
    if (!canAddNewUsers) {
      return res.sendStatus(403);
    }

    const newUserData = req.body.userData;

    const newId = await createUser(newUserData);

    if (newId === null) {
      return res.sendStatus(409);
    }

    return res.status(201).send({ id: newId });

  } catch (error) {
    res.sendStatus(500);
  }
};
