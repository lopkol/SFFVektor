'use strict';

const { getAuthorsWithProps } = require('../../../dao/authors/authors');
const { isAdmin } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canGetAuthors = await isAdmin(userData.id);
    if (!canGetAuthors) {
      return res.sendStatus(403);
    }

    const authors = await getAuthorsWithProps();
    
    return res.status(200).send({ authors });

  } catch (error) {
    res.sendStatus(500);
  }
};
