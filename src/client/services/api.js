'use strict';

const axios = require('axios');
const config = require('./config');

const axiosInstance = axios.create({
  baseURL: config.apiUrl
});

function setApiCookie(token) {
  axiosInstance.defaults.headers.common['Cookie'] = [`${config.cookieName}=${token}`];
}

module.exports = {
  api: axiosInstance,
  setApiCookie
};
