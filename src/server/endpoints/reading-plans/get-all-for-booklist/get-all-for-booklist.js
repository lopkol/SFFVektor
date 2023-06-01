'use strict';

const { getBookListById } = require('../../../dao/book-lists/book-lists');
const {
  createReadingPlans,
  getReadingPlansWithProps
} = require('../../../dao/reading-plans/reading-plans');

module.exports = async (req, res) => {
  try {
    const bookListId = req.params.bookListId;

    const bookListData = await getBookListById(bookListId);
    if (!bookListData) {
      return res.sendStatus(404);
    }

    const readingPlansByBook = await Promise.all(
      bookListData.bookIds.map(async bookId => {
        const readingPlansForBook = await getReadingPlansWithProps({ bookId });
        return readingPlansForBook;
      })
    );

    let readingPlansToCreate = [];
    readingPlansByBook.forEach((readingPlansOfBook, index) => {
      const existingUserIds = readingPlansOfBook.map(readingPlan => readingPlan.userId);
      const missingUserIds = bookListData.juryIds.filter(id => !existingUserIds.includes(id));
      readingPlansToCreate = readingPlansToCreate.concat(
        missingUserIds.map(id => ({
          userId: id,
          bookId: bookListData.bookIds[index],
          status: 'noPlan'
        }))
      );
    });
    if (readingPlansToCreate.length) {
      await createReadingPlans(readingPlansToCreate);
    }

    const allReadingPlansByBook = await Promise.all(
      bookListData.bookIds.map(async bookId => {
        const readingPlansForBook = await getReadingPlansWithProps({ bookId });
        return readingPlansForBook;
      })
    );

    return res.status(200).send({ readingPlansByBook: allReadingPlansByBook });
  } catch (error) {
    res.sendStatus(500);
  }
};
