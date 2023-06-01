'use strict';

const { omit } = require('lodash');
const { updateBookList } = require('../../../dao/book-lists/book-lists');
const { canManageBookLists } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canUpdateBookList = await canManageBookLists(userData.id);
    if (!canUpdateBookList) {
      return res.sendStatus(403);
    }

    const bookListId = req.params.bookListId;
    const bookListData = req.body.bookListData;

    const updatedBookListData = await updateBookList(bookListId, omit(bookListData, ['year', 'genre']));

    if (updatedBookListData === null) {
      return res.sendStatus(404);
    }

    return res.status(200).send({ bookListData: updatedBookListData });
  } catch (error) {
    res.sendStatus(500);
  }
};
