'use strict';

const { updateAuthor } = require('../../../dao/authors/authors');
const { isAdmin } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canUpdateAuthor = await isAdmin(userData.id);
    if (!canUpdateAuthor) {
      return res.sendStatus(403);
    }

    const authorId = req.params.authorId;
    const authorData = req.body.authorData;

    const updatedAuthorData = await updateAuthor(authorId, authorData);

    if (updatedAuthorData === null) {
      return res.sendStatus(404);
    }

    return res.status(200).send({ authorData: updatedAuthorData });
  } catch (error) {
    res.sendStatus(500);
  }
};
