'use strict';

const { getUsersByIds } = require('../../../dao/users/users');
const { getBookListsOfJuryMember } = require('../../../dao/book-lists/book-lists');

module.exports = async (req, res) => {
  try {
    const currentUserData = req.jwtData;
    const userId = currentUserData.id;

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
