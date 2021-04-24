'use strict';

const { createAuthor } = require('../../../dao/authors/authors');
const { isAdmin } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canCreateAuthor = await isAdmin(userData.id);
    if (!canCreateAuthor) {
      return res.sendStatus(403);
    }

    const newAuthor = req.body.authorData;

    if (!newAuthor.name || !newAuthor.sortName) {
      return res.sendStatus(400);
    }
    const newId = await createAuthor(newAuthor);

    return res.status(201).send({ id: newId });

  } catch (error) {
    res.sendStatus(500);
  }
};
