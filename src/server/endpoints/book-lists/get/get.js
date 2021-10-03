'use strict';

const { getBookListById } = require('../../../dao/book-lists/book-lists');
const { getUsersByIds } = require('../../../dao/users/users');
const { getBooksByIds } = require('../../../dao/books/books');
const { getAuthorById } = require('../../../dao/authors/authors');
const { getBookAlternativesByIds } = require('../../../dao/book-alternatives/book-alternatives');

module.exports = async (req, res) => {
  try {
    const { bookListId } = req.params;

    const bookList = await getBookListById(bookListId);
    if (!bookList) {
      return res.sendStatus(404);
    }

    const books = await getBooksByIds(bookList.bookIds || []);
    const booksWithAuthorsAndAlternatives = await Promise.all(books.map(async book => {
      const authors = await Promise.all(book.authorIds.map(async authorId => await getAuthorById(authorId)));
      const alternatives = await getBookAlternativesByIds(book.alternativeIds);
      return { ...book, authors, alternatives };
    }));

    const jury = await getUsersByIds(bookList.juryIds || []);
    
    return res.status(200).send({ bookList, books: booksWithAuthorsAndAlternatives, jury });

  } catch (error) {
    res.sendStatus(500);
  }
};

