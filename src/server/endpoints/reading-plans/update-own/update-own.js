'use strict';

const { setReadingPlans } = require('../../../dao/reading-plans/reading-plans');
const { getBookListById } = require('../../../dao/book-lists/book-lists');

module.exports = async (req, res) => {
  try {
    const currentUserData = req.jwtData;
    const userId = currentUserData.id;

    const bookListId = req.params.bookListId;

    const bookListData = await getBookListById(bookListId);
    if (!bookListData) {
      return res.sendStatus(404);
    }

    if (!bookListData.juryIds.includes(userId)) {
      return res.sendStatus(403);
    }

    const newReadingPlans = req.body.readingPlans;
    if (!newReadingPlans || !Array.isArray(newReadingPlans)) {
      return res.sendStatus(400);
    }

    for (let readingPlan of newReadingPlans) {
      if (readingPlan.userId !== userId) {
        return res.sendStatus(403);
      }
    }

    await setReadingPlans(newReadingPlans);

    return res.sendStatus(200);

  } catch (error) {
    res.sendStatus(500);
  }
};
