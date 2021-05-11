'use strict';

const { JSDOM } = require('jsdom');
const FormData = require('form-data');
const axios = require('axios');
const rax = require('retry-axios');
const fetch = require('node-fetch');

const { moly } = require('../../../config');
const { raxConfig } = require('../rax-config');

rax.attach();

async function getAuthenticityToken() {
  try {
    const res = await axios.get(moly.baseUrl + '/belepes', { raxConfig });
    const sessionCookie = res.headers['set-cookie'][0];
    const { document } = (new JSDOM(res.data)).window;
  
    const authInputNode = document.querySelector('[name=authenticity_token]');
    const authenticityToken = authInputNode.value;
  
    return { authenticityToken, sessionCookie };
  } catch (error) {
    throw new Error('login failed');
  }
}

async function getUserCredentials() {
  try {
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
  
    return userCredentialsCookie;
  } catch (error) {
    throw new Error('login failed');
  }
}

module.exports = {
  getAuthenticityToken,
  getUserCredentials
};
