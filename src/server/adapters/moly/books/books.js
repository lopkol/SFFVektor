'use strict';

const { JSDOM } = require('jsdom');
const axios = require('axios');
const rax = require('retry-axios');
const { moly } = require('../../../config');
const { raxConfig } = require('../rax-config');

rax.attach();

function removeJunkFromString(str) {
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
}
const middleDot = ' \u00B7 ';

function getAuthors(document) {
  const authorDiv = document.getElementsByClassName('authors')[0];
  const authorsNames = removeJunkFromString(authorDiv.textContent).split(middleDot);
  const authorLinksCollection = authorDiv.getElementsByTagName('a');

  const authors = authorsNames.map((name, index) =>
    ({
      name,
      molyUrl: moly.baseUrl + authorLinksCollection[index].href
    })
  );
  return authors;
}

function getTitleAndSeries(document) {
  const titleNode = document.getElementsByTagName('h1')[0].getElementsByTagName('span')[0];
  const isInSeries = titleNode.getElementsByTagName('a').length;
  let title = removeJunkFromString(titleNode.textContent);
  let series = '';
  let seriesNum = '';
  if (isInSeries) {
    const seriesText = titleNode.getElementsByTagName('a')[0].textContent.slice(1, -2);
    let words = seriesText.split(' ');
    seriesNum = words.pop();
    series = words.join(' ');
    title = title.slice(0, title.length - 5 - seriesText.length);
  } else {
    title = title.slice(0, title.length - 1);
  }
  return { title, series, seriesNum };
}

function getOriginal(document) {
  const originalDiv = document.querySelector('.databox.clearfix');
  if (!originalDiv) {
    return null;
  }
  const originalLink = originalDiv.querySelector('.book_selector');
  if (!originalLink) {
    return null;
  }
  const url = moly.baseUrl + originalLink.href;
  return {
    name: 'eredeti',
    urls: [url]
  };
}

async function getBookDetails(url) {
  try {
    const res = await axios.get(url, { raxConfig });
    const { document } = (new JSDOM(res.data)).window;

    const authors = getAuthors(document);
    const { title, series, seriesNum } = getTitleAndSeries(document);

    const originalVersion = getOriginal(document);
    const hunVersion = {
      name: 'magyar',
      urls: [url]
    };
    const alternatives = originalVersion ?
      [hunVersion, originalVersion] :
      [hunVersion];

    const book = { authors, title, series, seriesNum, alternatives };

    return book;
  } catch (error) {
    throw new Error(`failed to get book details from ${url}`);
  }
}

async function getOtherPages(document) {
  const paginationDiv = document.querySelector('.pagination');
  let otherPages = [];
  if (paginationDiv) {
    const pageLinkNodes = paginationDiv.querySelectorAll('a:not(.next_page)');
    pageLinkNodes.forEach(linkNode => {
      otherPages.push(moly.baseUrl + linkNode.href);
    });
  }
  return otherPages;
}

async function getBooksFromListPage(document) {
  const bookLinkNodes = document.querySelectorAll('.book_selector');

  const books = Array.from(bookLinkNodes).map(linkNode => ({
    url: moly.baseUrl + linkNode.href,
    id: linkNode.getAttribute('data-id')
  }));
  return books;
}

async function getBooksFromList(url) {
  try {
    const res = await axios.get(url, { raxConfig });
    const { document } = (new JSDOM(res.data)).window;

    const otherPages = await getOtherPages(document);
    const books = await getBooksFromListPage(document);

    const otherPagesBooks = await Promise.all(otherPages.map(async pageUrl => {
      const response = await axios.get(pageUrl, { raxConfig });
      const { document: doc } = (new JSDOM(response.data)).window;

      return getBooksFromListPage(doc);
    }));

    const bookUrls = books.concat(...otherPagesBooks);

    return bookUrls;
  } catch (error) {
    throw new Error(`failed to get books from list ${url}`);
  }
}

async function getBooksFromShelfPage(document) {
  const bookDivs = document.querySelectorAll('.tale_item');
  let books = [];

  bookDivs.forEach(bookDiv => {
    const bookLinkNode = bookDiv.querySelector('.book_selector');
    const url = moly.baseUrl + bookLinkNode.href;
    const id = bookLinkNode.getAttribute('data-id');
    const noteNode = bookDiv.querySelector('.sticky_note');
    const note = noteNode ? noteNode.textContent : '';
    books.push({ url, id, note });
  });

  return books;
}

async function getBooksFromShelf(url) {
  try {
    const res = await axios.get(url, { raxConfig });
    const { document } = (new JSDOM(res.data)).window;

    const otherPages = await getOtherPages(document);
    const books = await getBooksFromShelfPage(document);

    const otherPagesBooks = await Promise.all(otherPages.map(async pageUrl => {
      const response = await axios.get(pageUrl, { raxConfig });
      const { document: doc } = (new JSDOM(response.data)).window;

      return getBooksFromShelfPage(doc);
    }));

    const bookUrls = books.concat(...otherPagesBooks);

    return bookUrls;
  } catch (error) {
    throw new Error(`failed to get books from shelf ${url}`);
  }
}

function getBookIdsFromReadingList(document) {
  const contentDiv = document.getElementById('content');

  const bookNodes = contentDiv.querySelectorAll('.book_selector');
  const bookIds = Array.from(bookNodes).map(linkNode => linkNode.getAttribute('data-id'));

  return bookIds;
}

async function getBooksReadByUser(userMolyUrl, userCredentialsCookie) {
  try {
    const res = await axios.get(`${userMolyUrl}/olvasmanylista-teljes`, { raxConfig, headers: { Cookie: userCredentialsCookie } });
    const { document } = (new JSDOM(res.data)).window;

    return getBookIdsFromReadingList(document);
  } catch (e) {
    throw new Error(`Failed to get books from ${userMolyUrl}`);
  }
}

module.exports = {
  getBookDetails,
  getBooksFromList,
  getBooksFromShelf,
  getBooksReadByUser
};
