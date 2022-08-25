'use strict';

const { getAuthorById } = require('../../../dao/authors/authors');
const { isAdmin } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canGetAuthor = await isAdmin(userData.id);
    if (!(canGetAuthor)) {
      return res.sendStatus(403);
    }
    const authorId = req.params.authorId;

    const authorData = await getAuthorById(authorId);
    if (!authorData) {
      return res.sendStatus(404);
    }

    return res.status(200).send({ authorData });

  } catch (error) {
    res.sendStatus(500);
  }
};
