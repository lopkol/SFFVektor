'use strict';

const { JSDOM } = require('jsdom');
const axios = require('axios');
//const { moly } = require('../../config');

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
      molyUrl: authorLinksCollection[index].href
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
  }
  return { title, series, seriesNum };
}

async function getBookDetails(url) {
  //TODO: error handling
  const res = await axios.get(url);
  const { document } = (new JSDOM(res.data)).window;

  const authors = getAuthors(document);
  const { title, series, seriesNum } = getTitleAndSeries(document);

  //TODO: original/alternative versions (link, title, moly id?)

  const book = { authors, title, series, seriesNum };

  return book;
}

/*async function getBooksFromList(url) {
  //TODO: error handling
  const res = await axios.get(url);
  const { document } = (new JSDOM(res.data)).window;

  const contentDiv = await document.getElementById('content');
  const bookListItems = contentDiv.querySelectorAll('[id^=list_item_]');
} */

module.exports = {
  getBookDetails,
  //getBooksFromList
};
