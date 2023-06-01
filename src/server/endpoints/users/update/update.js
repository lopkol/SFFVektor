'use strict';

const { omit } = require('lodash');
const { updateUser } = require('../../../dao/users/users');
const { updateBookListsOfJuryMember } = require('../../../dao/book-lists/book-lists');
const { canManageUsers } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const currentUserData = req.jwtData;

    const userId = req.params.userId;

    const isOwnAccount = currentUserData.id === userId;
    const canUpdateAllUsers = await canManageUsers(currentUserData.id);

    if (!(canUpdateAllUsers || isOwnAccount)) {
      return res.sendStatus(403);
    }

    if (isOwnAccount && !canUpdateAllUsers && req.body.userData.hasOwnProperty('role')) {
      return res.sendStatus(403);
    }

    const userDataToUpdate = req.body.userData;
    const newBookListIds = userDataToUpdate.bookListIds || [];

    const updatedUserData = await updateUser(userId, omit(userDataToUpdate, 'bookListIds'));

    if (updatedUserData === null) {
      return res.sendStatus(404);
    }

    await updateBookListsOfJuryMember(userId, newBookListIds);

    return res.status(200).send({ userData: updatedUserData });
  } catch (error) {
    res.sendStatus(500);
  }
};
