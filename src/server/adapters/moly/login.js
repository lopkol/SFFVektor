'use strict';

const { JSDOM } = require('jsdom');
const FormData = require('form-data');
const axios = require('axios');
const rax = require('retry-axios');
const fetch = require('node-fetch');
/*const fetch = require('fetch-retry')(originalFetch, {
  retries: 4,
  retryDelay: 100,
  retryOn: async function(attempt, error, response) {
    // retry on any network error, or 4xx or 5xx status codes
    const res = await response;
    if (error !== null || res.status >= 400) {
      console.log(`retrying, attempt number ${attempt + 1}`);
      return true;
    }
  }
});*/

const { moly } = require('../../config');
const { raxConfig } = require('./rax-config');

rax.attach();

/*Fetch retry: these don't work...

const fetchPlus = (url, options = {}, retries) =>
  fetch(url, options)
    .then(res => {
      console.log(retries);
      if (res.status <= 399) {
        return res;
      }
      if (retries > 0) {
        return fetchPlus(url, options, retries - 1);
      }
      throw new Error(res.status);
    })
    .catch(error => console.error(error.message));

const fetchRetry = async (url, options, n) => {
  try {
    const res = await fetch(url, options);
    if (res.status >= 400 && n > 1) {
      console.log(`${n-1} attempts left`);
      return await fetchRetry(url, options, n - 1);
    }
    return res;
  } catch (err) {
    if (n === 1) throw err;
    console.log(`${n-1} attempts left`);
    return await fetchRetry(url, options, n - 1);
  }
};

async function fetchRetry(url, options, n) {
  let error;
  for (let i = 0; i < n; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status >= 400) {
        throw new Error('request failed');
      }
      return res;
    } catch (err) {
      error = err;
    }
  }
  throw error;
} */

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
    const userCredentials = userCredentialsCookie.split(';')[0];
  
    return userCredentials;
  } catch (error) {
    throw new Error('login failed');
  }
}

module.exports = {
  getAuthenticityToken,
  getUserCredentials
};
