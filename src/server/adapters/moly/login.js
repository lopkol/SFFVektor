'use strict';

const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const FormData = require('form-data');
const axios = require('axios');
const { moly } = require('../../config');

async function getAuthenticityToken() {
  //TODO: error handling
  const res = await axios.get(moly.baseUrl + '/belepes');
  const sessionCookie = res.headers['set-cookie'][0];
  const { document } = (new JSDOM(res.data)).window;

  const authInputNode = document.querySelector('[name=authenticity_token]');
  const authenticityToken = authInputNode.value;

  return { authenticityToken, sessionCookie };
}

async function getUserCredentials() {
  //TODO: error handling
  const { authenticityToken, sessionCookie } = await getAuthenticityToken();
 
  const form = new FormData();
  form.append('authenticity_token', authenticityToken);
  form.append('user_session[email]', moly.sffVektorUsername);
  form.append('user_session[password]', moly.sffVektorPassword);
  form.append('commit', 'Belépés');

  const res = await fetch(moly.baseUrl + '/azonositas', {
    method: 'POST',
    body: form,
    redirect: 'manual',
    headers: { 
      ...form.getHeaders(),
      Cookie: sessionCookie
    }
  });

  const userCredentialsCookie = res.headers.raw()['set-cookie'][0];
  const userCredentials = userCredentialsCookie.split(';')[0];

  return userCredentials;
}

module.exports = {
  getAuthenticityToken,
  getUserCredentials
};
