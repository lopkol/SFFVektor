'use strict';

const { getBooksWithProps } = require('../../../dao/books/books');
const { getAuthorById } = require('../../../dao/authors/authors');
const { getBookAlternativesByIds } = require('../../../dao/book-alternatives/book-alternatives');
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
    const booksWithAuthorsAndAlternatives = await Promise.all(books.map(async book => {
      const authors = await Promise.all(book.authorIds.map(async authorId => await getAuthorById(authorId)));
      const alternatives = await getBookAlternativesByIds(book.alternativeIds);
      return { ...book, authors, alternatives };
    }));

    //TODO: also add bookListIds
    
    return res.status(200).send({ books: booksWithAuthorsAndAlternatives });

  } catch (error) {
    res.sendStatus(500);
  }
};
