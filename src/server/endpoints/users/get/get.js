'use strict';

const { getUsersByIds } = require('../../../dao/users/users');
const { getBookListsOfJuryMember } = require('../../../dao/book-lists/book-lists');
const { canManageUsers } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const currentUserData = req.jwtData;

    const userId = req.params.userId;

    const isOwnAccount = currentUserData.id === userId;
    const canSeeAllUsers = await canManageUsers(currentUserData.id);

    if (!(canSeeAllUsers || isOwnAccount)) {
      return res.sendStatus(403);
    }

    const [userData] = await getUsersByIds([userId]);
    if (!userData) {
      return res.sendStatus(404);
    }

    const bookLists = await getBookListsOfJuryMember(userId);

    return res.status(200).send({ userData: { bookLists, ...userData } });
  } catch (error) {
    res.sendStatus(500);
  }
};
