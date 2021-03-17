'use strict';

const { omit } = require('lodash');
const { createUser } = require('../../../dao/users/users');
const { updateBookListsOfJuryMember } = require('../../../dao/book-lists/book-lists');
const { canManageUsers } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canAddNewUsers = await canManageUsers(userData.id);
    if (!canAddNewUsers) {
      return res.sendStatus(403);
    }

    const newUserData = req.body.userData;
    const newBookListIds = newUserData.bookListIds || [];

    const newId = await createUser(omit(newUserData, 'bookListIds'));

    if (newId === null) {
      return res.sendStatus(409);
    }

    await updateBookListsOfJuryMember(newId, newBookListIds);

    return res.status(201).send({ id: newId });

  } catch (error) {
    res.sendStatus(500);
  }
};
