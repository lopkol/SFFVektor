'use strict';

const { omit } = require('lodash');
const { setBooks, getBooksByIds } = require('../../../dao/books/books');
const { canManageBooks } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canUpdateBook = await canManageBooks(userData.id);
    if (!canUpdateBook) {
      return res.sendStatus(403);
    }

    const bookId = req.params.bookId;
    const [savedBook] = await getBooksByIds([bookId]);
    if (savedBook === null) {
      return res.sendStatus(404);
    }

    const newBookData = req.body.bookData;
    if (!newBookData) {
      return res.sendStatus(400);
    }

    await setBooks([{ id: bookId, ...omit(newBookData, ['year', 'isPending']) }]);
    const [updatedBook] = await getBooksByIds([bookId]);

    return res.status(200).send({ bookData: updatedBook });

  } catch (error) {
    res.sendStatus(500);
  }
};
