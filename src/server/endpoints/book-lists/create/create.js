'use strict';

const { createBookList } = require('../../../dao/book-lists/book-lists');
const { canManageBookLists } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canAddNewBookList = await canManageBookLists(userData.id);
    if (!canAddNewBookList) {
      return res.sendStatus(403);
    }

    const newBookList = req.body.bookListData;

    if (!newBookList.year || !newBookList.genre) {
      return res.sendStatus(400);
    }
    const newId = await createBookList(newBookList);

    if (newId === null) {
      return res.sendStatus(409);
    }

    return res.status(201).send({ id: newId });
  } catch (error) {
    res.sendStatus(500);
  }
};
