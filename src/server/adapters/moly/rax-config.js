'use strict';

const raxConfig = {
  retry: 3,
  noResponseRetries: 2,
  retryDelay: 100,
  statusCodesToRetry: [[100, 199], [400, 429], [500, 599]],
  httpMethodsToRetry: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
};

module.exports = {
  raxConfig
};
