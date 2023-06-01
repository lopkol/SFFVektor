'use strict';

const { updateBookAlternative } = require('../../../dao/book-alternatives/book-alternatives');
const { isAdmin } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canUpdateBookAlternative = await isAdmin(userData.id);
    if (!canUpdateBookAlternative) {
      return res.sendStatus(403);
    }

    const bookAlternativeId = req.params.bookAlternativeId;
    const bookAlternativeData = req.body.bookAlternativeData;

    const updatedBookAlternativeData = await updateBookAlternative(
      bookAlternativeId,
      bookAlternativeData
    );

    if (updatedBookAlternativeData === null) {
      return res.sendStatus(404);
    }

    return res.status(200).send({ bookAlternativeData: updatedBookAlternativeData });
  } catch (error) {
    res.sendStatus(500);
  }
};
