'use strict';

const { getBookListById } = require('../../../dao/book-lists/book-lists');
const { getUsersByIds } = require('../../../dao/users/users');
const { getBooksByIds } = require('../../../dao/books/books');
const { getAuthorById } = require('../../../dao/authors/authors');
const { canViewBookList } = require('../../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const userId = req.jwtData.id;

    const { year, genre } = req.params;
    const bookListId = year + genre;

    const bookList = await getBookListById(bookListId);
    if (!bookList) {
      return res.sendStatus(404);
    }

    const canGetBookList = await canViewBookList(userId, bookListId);

    if (!canGetBookList) {
      return res.sendStatus(403);
    }

    const books = await getBooksByIds(bookList.bookIds);
    const booksWithAuthors = await Promise.all(books.map(async book => {
      const authors = await Promise.all(book.authorIds.map(async authorId => await getAuthorById(authorId)));
      return { ...book, authors };
    }));

    const jury = await getUsersByIds(bookList.juryIds);
    
    return res.status(200).send({ bookList, books: booksWithAuthors, jury });

  } catch (error) {
    res.sendStatus(500);
  }
};

