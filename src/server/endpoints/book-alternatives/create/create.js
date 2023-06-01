'use strict';

const { createBookAlternative } = require('../../../dao/book-alternatives/book-alternatives');
const { isAdmin } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canCreateBookAlternative = await isAdmin(userData.id);
    if (!canCreateBookAlternative) {
      return res.sendStatus(403);
    }

    const newBookAlternative = req.body.bookAlternativeData;

    if (!newBookAlternative.name || !newBookAlternative.urls || newBookAlternative.urls.length === 0) {
      return res.sendStatus(400);
    }
    const newId = await createBookAlternative(newBookAlternative);

    return res.status(201).send({ id: newId });
  } catch (error) {
    res.sendStatus(500);
  }
};
