'use strict';

const { getBookListById } = require('../../../dao/book-lists/book-lists');
const { createReadingPlans, getReadingPlansWithProps } = require('../../../dao/reading-plans/reading-plans');

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
      return res.sendStatus(204);
    }

    const allReadingPlans = await getReadingPlansWithProps({ userId });
    const filteredReadingPlans = allReadingPlans.filter(readingPlan => bookListData.bookIds.includes(readingPlan.bookId));
    
    const existingBookIds = filteredReadingPlans.map(readingPlan => readingPlan.bookId);
    const toCreate = bookListData.bookIds.filter(bookId => !existingBookIds.includes(bookId));
    const newReadingPlansData = toCreate.map(bookId => ({
      bookId,
      userId,
      status: 'noPlan'
    }));
    if (newReadingPlansData.length) {
      await createReadingPlans(newReadingPlansData);
    }

    const newReadingPlans = newReadingPlansData.map(readingPlanData => ({
      ...readingPlanData,
      id: readingPlanData.userId.concat(readingPlanData.bookId)
    }));

    const readingPlans = filteredReadingPlans.concat(newReadingPlans);

    return res.status(200).send({ readingPlans });

  } catch (error) {
    res.sendStatus(500);
  }
};
