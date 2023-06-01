'use strict';

const nock = require('nock');
const { getBookDetails, getBooksFromList, getBooksFromShelf, getBooksReadByUser } = require('./books');
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
} = require('../../../../../test-helpers/moly/books-adapter');
const {
  testReadingListPage,
  testUserMolyUrl,
  testBookIds
} = require('../../../../../test-helpers/moly/reading-plans-adapter');
const { moly } = require('../../../config');

describe('Moly books adapter', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getBookDetails', () => {
    it('returns book details correctly', async () => {
      nock(moly.baseUrl).get(testBookUrl).reply(200, testBookPage);

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
      nock(moly.baseUrl).get(testBookShelfUrl).reply(200, testBookShelfPage);

      const res = await getBooksFromShelf(moly.baseUrl + testBookShelfUrl);

      expect(res).toEqual(jasmine.arrayWithExactContents(testBooksFromShelf));
    });
  });

  describe('getBooksFromList', () => {
    it('returns the book urls of the list', async () => {
      nock(moly.baseUrl).get(`${testUserMolyUrl}/olvasmanylista-teljes`).reply(200, testReadingListPage);

      const res = await getBooksReadByUser(
        moly.baseUrl + testUserMolyUrl,
        'user_credentials=0dfbbd1cd6a678974d1a7146755a980fa2781ecc4bbf2931c75f909986c9274c93a527bdfe8683a1e03b1b469154cb3dc8f7e8671f78cf542607379eabba2760%3A%3A301775%3A%3A2021-05-23T20%3A15%3A19%2B02%3A00; Path=/; Secure; HttpOnly;'
      );

      expect(res).toEqual(jasmine.arrayWithExactContents(testBookIds));
    });
  });
});
