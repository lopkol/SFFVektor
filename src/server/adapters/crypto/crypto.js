'use strict';

const crypto = require('crypto');
const config = require('../../config');

const dataEncryptionAlgorithm = 'aes256';
const keyLengthInBytes = 16;
const dataEncryptionSalt = '7m1xTkRGV9zBF';
const initializationVectorLength = 16;

function scrypt(string, salt, length) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(string, salt, length, {}, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result.toString('hex'));
    });
  });
}

function hashEmail(email) {
  return scrypt(email, config.dataEncryption.emailSalt, config.dataEncryption.emailHashLength);
}

let dataEncryptionKey;
async function getDataEncryptionKey() {
  if (!dataEncryptionKey) {
    dataEncryptionKey = await scrypt(
      config.dataEncryption.secret,
      dataEncryptionSalt,
      keyLengthInBytes
    );
  }

  return dataEncryptionKey;
}

async function encrypt(data) {
  const initializationVector = await crypto.randomBytes(initializationVectorLength);
  const encryptionKey = await getDataEncryptionKey();
  const cipher = crypto.createCipheriv(
    dataEncryptionAlgorithm,
    encryptionKey,
    initializationVector
  );

  const stringifiedData = JSON.stringify(data);
  let encryptedData = cipher.update(stringifiedData, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  return `${encryptedData}_${initializationVector.toString('hex')}`;
}

async function decrypt(encryptedData) {
  const [cypherText, initializationVectorAsString] = encryptedData.split('_');
  const initializationVector = Buffer.from(initializationVectorAsString, 'hex');
  const encryptionKey = await getDataEncryptionKey();
  const decipher = crypto.createDecipheriv(
    dataEncryptionAlgorithm,
    encryptionKey,
    initializationVector
  );

  let stringifiedData = decipher.update(cypherText, 'hex', 'utf8');
  stringifiedData += decipher.final('utf8');

  return JSON.parse(stringifiedData);
}

module.exports = {
  hashEmail,
  encrypt,
  decrypt
};
