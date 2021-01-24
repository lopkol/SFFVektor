'use strict';

const { encode, decode } = require('./jwt');

describe('JWT', () => {
  it('the encoded token can be decoded correctly', () => {
    const data = {
      some: 'nice',
      serializable: ['data']
    };

    const token = encode(data);
    const decodedData = decode(token);

    expect(decodedData).toEqual(data);
  });
});
