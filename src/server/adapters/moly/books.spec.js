'use strict';

const nock = require('nock');
const {
  getBookDetails,
  getBooksFromList,
  getBooksFromShelf
} = require('./books');
const { 
  testBookUrl, 
  testAuthors, 
  testBookTitle, 
  testSeries, 
  testSeriesNum, 
  testAlternatives, 
  testBookPage,
  testBookListUrl,
  testBookListPage1,
  testBookListPage2, 
  testBooksFromList,
  testBookShelfUrl,
  testBookShelfPage,
  testBooksFromShelf
} = require('../../../../test-helpers/moly');
const { moly } = require('../../config');

describe('Moly adapter', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getBookDetails', () => {
    it('returns book details correctly', async () => {
      nock(moly.baseUrl)
        .get(testBookUrl)
        .reply(200, testBookPage);

      const res = await getBookDetails(moly.baseUrl + testBookUrl);

      expect(res).toEqual({
        authors: jasmine.arrayWithExactContents(testAuthors),
        title: testBookTitle,
        series: testSeries,
        seriesNum: testSeriesNum,
        alternatives: jasmine.arrayWithExactContents(testAlternatives)
      });
    });
  });

  describe('getBooksFromList', () => {
    it('returns the book urls of the list', async () => {
      nock(moly.baseUrl)
        .get(testBookListUrl)
        .reply(200, testBookListPage1)
        .get(testBookListUrl + '?page=2')
        .reply(200, testBookListPage2);

      const res = await getBooksFromList(moly.baseUrl + testBookListUrl);
      
      expect(res).toEqual(jasmine.arrayWithExactContents(testBooksFromList));
    });
  });

  describe('getBooksFromShelf', () => {
    it('returns the book urls of the shelf', async () => {
      nock(moly.baseUrl)
        .get(testBookShelfUrl)
        .reply(200, testBookShelfPage);

      const res = await getBooksFromShelf('https://moly.hu/polcok/besorolasra-var-2020');
      
      expect(res).toEqual(jasmine.arrayWithExactContents(testBooksFromShelf));
    });
  });
});
