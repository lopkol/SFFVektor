'use strict';

const { encrypt, decrypt } = require('./crypto');

describe('encryption and decryption', () => {
  it('encrypted data can be decrypted correctly', async () => {
    const data = {
      some: 'nice',
      serializable: ['data']
    };

    const encryptedData = await encrypt(data);
    const decryptedData = await decrypt(encryptedData);

    expect(decryptedData).toEqual(data);
  });
});
