'use strict';

const { getBookListById, updateBookList } = require('../../../dao/book-lists/book-lists');
const { getBooksByIds, setBooks } = require('../../../dao/books/books');
const { createAuthor, getAuthorsWithProps } = require('../../../dao/authors/authors');
const { createBookAlternative, getBookAlternativeWithUrl } = require('../../../dao/book-alternatives/book-alternatives');

const { getBookDetails, getBooksFromList, getBooksFromShelf } = require('../../../adapters/moly/books/books');

const { isAdmin } = require('../../../lib/permissions');
const { genreOptions } = require('../../../../options');

module.exports = async (req, res) => {
  const userId = req.jwtData.id;

  const canTriggerUpdate = await isAdmin(userId);
  if (!canTriggerUpdate) {
    return res.sendStatus(403);
  }

  const { bookListId } = req.params;
  
  const bookList = await getBookListById(bookListId);
  if (!bookList) {
    return res.sendStatus(404);
  }

  const { url, pendingUrl, year, genre } = bookList;
  const genreName = genreOptions.find(option => option.id === genre).name;

  const bookUrlsFromList = await getBooksFromList(url);
  const bookUrlsFromPendingShelf = await getBooksFromShelf(pendingUrl);

  const booksFromList = await Promise.all(bookUrlsFromList.map(async book => {
    const details = await getBookDetails(book.url);
    return {
      details,
      year,
      ...book
    };
  }));

  const booksFromPendingShelf = await Promise.all(bookUrlsFromPendingShelf.map(async book => {
    const details = await getBookDetails(book.url);
    return {
      details,
      year,
      ...book
    };
  }));

  let booksToSave = [];
  let newBookIds = [];

  for (let i = 0; i < booksFromList.length; i++) {
    const book = booksFromList[i];
    newBookIds.push(book.id);
    const bookDataToSave = await constructBookDataToSave(book, false);
    if (bookDataToSave) {
      booksToSave.push(bookDataToSave);
    }
  }
  for (let i = 0; i < booksFromPendingShelf.length; i++) {
    const book = booksFromPendingShelf[i];
    if (book.note.includes(genreName)) {
      newBookIds.push(book.id);
    }
    const bookDataToSave = await constructBookDataToSave(book, true);
    if (bookDataToSave) {
      booksToSave.push(bookDataToSave);
    }
  }

  await setBooks(booksToSave);
  await updateBookList(bookListId, { bookIds: newBookIds });
  
  return res.sendStatus(200);
};

async function createOrGetAuthor(author) {
  const name = author.name;
  const authorsWithName = await getAuthorsWithProps({ name });

  if (authorsWithName.length === 0) {
    const hunChars = /[áéíóúöüőű]/i;
    const isHun = hunChars.test(name);
    const names = name.split(' ');
    const lastName = isHun ?
      names[0] :
      names[names.length - 1];
    const firstNames = isHun ? 
      names.slice(1).join(' ') :
      names.slice(0, names.length - 1).join(' ');
    const id = await createAuthor({
      name,
      sortName: `${lastName}, ${firstNames}`,
      isApproved: false
    });
    return id;

  } else {
    const id = authorsWithName[0].id;
    return id;
  }
}

async function createOrGetBookAlternative(bookAlternative) {
  const [url] = bookAlternative.urls;
  const alternativeWithUrl = await getBookAlternativeWithUrl(url);

  if (!alternativeWithUrl) {
    const id = await createBookAlternative(bookAlternative);
    return id;

  } else {
    const id = alternativeWithUrl.id;
    return id;
  }
}

async function constructBookDataToSave(book, isPending) {
  const [bookInDb] = await getBooksByIds([book.id]);

  if (bookInDb) {
    if (bookInDb.isApproved) {
      if (bookInDb.isPending && !isPending) {
        return {
          id: book.id,
          isPending: false
        };
      } else {
        return null;
      }
    }
  }

  const authorIds = await Promise.all(book.details.authors.map(author => createOrGetAuthor(author)));
  const alternativeIds = await Promise.all(book.details.alternatives.map(alternative => createOrGetBookAlternative(alternative)));

  return {
    id: book.id,
    authorIds,
    title: book.details.title,
    year: book.year,
    series: book.details.series,
    seriesNum: book.details.seriesNum,
    alternativeIds,
    isApproved: false,
    isPending
  };
}
