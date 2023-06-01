'use strict';

const app = require('../src/server/app');
const { port } = require('../src/server/config');

function withServer(testFunction) {
  return async () => {
    let server;
    try {
      server = await app.listen(port);
      await testFunction();
      await server.close();
    } catch (error) {
      await server.close();
      throw error;
    }
  };
}

module.exports = {
  withServer
};
