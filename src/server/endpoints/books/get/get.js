'use strict';

const { getBooksByIds } = require('../../../dao/books/books');
const { getAuthorById } = require('../../../dao/authors/authors');
const { getBookAlternativesByIds } = require('../../../dao/book-alternatives/book-alternatives');
const { getBookListsOfBook } = require('../../../dao/book-lists/book-lists');

module.exports = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const [book] = await getBooksByIds([bookId]);
    if (!book) {
      return res.sendStatus(404);
    }

    const authors = await Promise.all(book.authorIds.map(async authorId => await getAuthorById(authorId)));
    const alternatives = await getBookAlternativesByIds(book.alternativeIds);
    const bookLists = await getBookListsOfBook(bookId);

    const bookData = { ...book, authors, alternatives, bookLists };

    return res.status(200).send({ bookData });

  } catch (error) {
    res.sendStatus(500);
  }
};
