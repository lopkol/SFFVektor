'use strict';

const { api } = require('../api');

//TODO: error handling

async function getOwnReadingPlans(bookListId) {
  const response = await api.get(`/api/reading-plans/own/${bookListId}`);
  if (response.status === 204) {
    return null;
  }
  return response.data.readingPlans;
}

async function updateOwnReadingPlans(bookListId, newReadingPlans) {
  await api.put(`/api/reading-plans/own/${bookListId}`, { readingPlans: newReadingPlans });
}

async function getAllReadingPlansForBookList(bookListId) {
  const response = await api.get(`/api/reading-plans/all/${bookListId}`);
  return response.data.readingPlansByBook;
}

module.exports = {
  getOwnReadingPlans,
  updateOwnReadingPlans,
  getAllReadingPlansForBookList
};
