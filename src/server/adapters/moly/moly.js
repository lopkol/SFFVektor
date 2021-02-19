'use strict';

const { JSDOM } = require('jsdom');
const axios = require('axios');
//const { moly } = require('../../config');

async function getBookDetails(url) {
  const res = await axios.get(url);
  const { document } = (new JSDOM(res.data)).window;

  const contentDiv = await document.getElementById('content');

  //the following only works if the novel is not in a collection (for ex. Galaktika) - should handle that case separately
  const authorDiv = contentDiv.getElementsByClassName('authors')[0];
  const authorsNames = authorDiv.textContent.split(' \u00B7 ');
  const authorLinksCollection = authorDiv.getElementsByTagName('a');

  const authors = authorsNames.map((name, index) => 
    ({
      name,
      molyUrl: authorLinksCollection[index].href
    })
  ); 

  const titleSpan = contentDiv.getElementsByTagName('h1')[0].getElementsByTagName('span')[0];
  const isInSeries = titleSpan.getElementsByTagName('a').length;
  let title = titleSpan.textContent;
  let series = '';
  let seriesNum = '';
  if (isInSeries) {
    const seriesText = titleSpan.getElementsByTagName('a')[0].textContent.slice(1, -2);
    let words = seriesText.split(' ');
    seriesNum = words.pop();
    series = words.join(' ');
    title = title.slice(0, title.length - 5 - seriesText.length);
  }
  const book = { authors, title, series, seriesNum };

  return book;
}

module.exports = {
  getBookDetails,
};
