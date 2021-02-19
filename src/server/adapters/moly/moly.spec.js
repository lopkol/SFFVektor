'use strict';

const nock = require('nock');
const {
  getBookDetails
} = require('./moly');
const { testBookUrl, testAuthors, testBookTitle, testSeries, testSeriesNum, testBookPage } = require('../../../../test-helpers/moly');
const { moly } = require('../../config');

describe('Moly adapter', () => {
  describe('getBookDetails', () => {
    beforeEach(() => {
      nock(moly.baseUrl)
        .get(testBookUrl)
        .reply(200, testBookPage);
    });
    afterEach(() => {
      nock.cleanAll();
    });

    it('returns book details correctly', async () => {
      const res = await getBookDetails(moly.baseUrl + testBookUrl);

      expect(res).toEqual({
        authors: jasmine.arrayWithExactContents(testAuthors),
        title: testBookTitle,
        series: testSeries,
        seriesNum: testSeriesNum
      });
    });
  });
});
