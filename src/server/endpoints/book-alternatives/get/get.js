'use strict';

const { getBookAlternativesByIds } = require('../../../dao/book-alternatives/book-alternatives');
const { isAdmin } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canGetBookAlternative = await isAdmin(userData.id);
    if (!canGetBookAlternative) {
      return res.sendStatus(403);
    }
    const bookAlternativeId = req.params.bookAlternativeId;

    const [bookAlternativeData] = await getBookAlternativesByIds([bookAlternativeId]);
    if (!bookAlternativeData) {
      return res.sendStatus(404);
    }

    return res.status(200).send({ bookAlternativeData });
  } catch (error) {
    res.sendStatus(500);
  }
};
