'use strict';

const { getBookListsWithProps } = require('../../../dao/book-lists/book-lists');

module.exports = async (req, res) => {
  try {
    const bookLists = await getBookListsWithProps();
    
    return res.status(200).send({ bookLists });

  } catch (error) {
    res.sendStatus(500);
  }
};
