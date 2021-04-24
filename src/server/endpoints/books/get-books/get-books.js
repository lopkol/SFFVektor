'use strict';

const { getBooksWithProps } = require('../../../dao/books/books');
const { getAuthorById } = require('../../../dao/authors/authors');
const { getBookAlternativesByIds } = require('../../../dao/book-alternatives/book-alternatives');
const { getBookListsOfBook } = require('../../../dao/book-lists/book-lists');
const { canManageBooks } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userData = req.jwtData;

    const canGetBooks = await canManageBooks(userData.id);
    if (!canGetBooks) {
      return res.sendStatus(403);
    }

    const year = req.params.year;

    const books = await getBooksWithProps({ year });
    const booksWithDetails = await Promise.all(books.map(async book => {
      const authors = await Promise.all(book.authorIds.map(async authorId => await getAuthorById(authorId)));
      const alternatives = await getBookAlternativesByIds(book.alternativeIds);
      const bookLists = await getBookListsOfBook(book.id);
      return { ...book, authors, alternatives, bookLists };
    }));
    
    return res.status(200).send({ books: booksWithDetails });

  } catch (error) {
    res.sendStatus(500);
  }
};
