'use strict';

const { omit } = require('lodash');
const { setBooks, getBooksByIds } = require('../../../dao/books/books');
const { createBookAlternative, updateBookAlternative, deleteBookAlternative } = require('../../../dao/book-alternatives/book-alternatives');
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

    const previousAlternativeIds = req.body.previousAlternativeIds || [];

    if (newBookData.alternativeIds) {
      const alternativesToDelete = previousAlternativeIds.filter(alternativeId => !newBookData.alternativeIds.includes(alternativeId));
      await Promise.all(alternativesToDelete.map(alternativeId => deleteBookAlternative(alternativeId)));
    }

    if (newBookData.alternatives && newBookData.alternativeIds) {
      const alternativesToUpdate = newBookData.alternatives.filter(alternative => alternative.id);
      await Promise.all(alternativesToUpdate.map(alternative => updateBookAlternative(alternative.id, omit(alternative, 'id'))));

      const alternativesToCreate = newBookData.alternatives.filter(alternative => !alternative.id);
      const createdAlternativeIds = await Promise.all(alternativesToCreate.map(alternative => createBookAlternative(omit(alternative, 'id'))));

      newBookData.alternativeIds = newBookData.alternativeIds.concat(createdAlternativeIds).filter(alternativeId => alternativeId);
    }

    await setBooks([{ id: bookId, ...omit(newBookData, ['year', 'isPending']) }]);
    const [updatedBook] = await getBooksByIds([bookId]);

    return res.status(200).send({ bookData: updatedBook });

  } catch (error) {
    res.sendStatus(500);
  }
};
