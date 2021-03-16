'use strict';

const { withServer } = require('../../../../../test-helpers/server');
const { createUser } = require('../../../../server/dao/users/users');
const { createAuthor } = require('../../../../server/dao/authors/authors');
const { setBooks } = require('../../../../server/dao/books/books');
const { createBookList } = require('../../../../server/dao/book-lists/book-lists');
const { createBookAlternatives } = require('../../../../server/dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { 
  generateRandomAuthor, 
  generateRandomUser, 
  generateRandomBookAlternative,
  generateRandomBook, 
  generateRandomBookList 
} = require('../../../../../test-helpers/generate-data');
const { logUserIn, logUserOut } = require('../../../../../test-helpers/authorization');

const { getBookList } = require('./book-lists');

describe('client-side book list related API calls', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookLists'),
      clearCollection('authors')
    ]);
  });

  afterEach(async () => {
    logUserOut();
  });

  describe('getBookList', () => {
    it('returns the book list data if the user is admin', withServer(async () => {
      const userData = generateRandomUser({ role: 'admin' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'admin' });

      const userData2 = generateRandomUser();
      const userData3 = generateRandomUser();
      const userId2 = await createUser(userData2);
      const userId3 = await createUser(userData3);

      const authorData1 = generateRandomAuthor();
      const authorData2 = generateRandomAuthor();
      const authorId1 = await createAuthor(authorData1);
      const authorId2 = await createAuthor(authorData2);

      const alternativeData1 = await generateRandomBookAlternative();
      const alternativeData2 = await generateRandomBookAlternative();
      const [alternativeId1, alternativeId2] = await createBookAlternatives([alternativeData1, alternativeData2]);

      const bookData1 = generateRandomBook({ authorIds: [authorId1], alternativeIds: [alternativeId1] });
      const bookData2 = generateRandomBook({ authorIds: [authorId2], alternativeIds: [alternativeId2] });
      await setBooks([bookData1, bookData2]);

      const bookListData = await generateRandomBookList({ juryIds: [userId2, userId3], bookIds: [bookData1.id, bookData2.id] });
      const year = bookListData.year;
      const genre = bookListData.genre;
      const bookListId = await createBookList(bookListData);

      const bookList = await getBookList({ year, genre });

      const expectedData = {
        bookList: {
          id: bookListId,
          ...bookListData
        },
        books: jasmine.arrayWithExactContents([
          { ...bookData1, authors: [{ id: authorId1, ...authorData1 }], alternatives: [{ id: alternativeId1, ...alternativeData1 }] },
          { ...bookData2, authors: [{ id: authorId2, ...authorData2 }], alternatives: [{ id: alternativeId2, ...alternativeData2 }] }
        ]),
        jury: jasmine.arrayWithExactContents([ 
          { id: userId2, ...userData2 }, 
          { id: userId3, ...userData3 } 
        ])
      };

      expect(bookList).toEqual(expectedData);
    }));

    it('returns the book list data if the user is a jury member of the book list', withServer(async () => {
      const userData = generateRandomUser({ role: 'user' });
      const userId = await createUser(userData);

      await logUserIn({ id: userId, role: 'user' });

      const userData2 = generateRandomUser();
      const userData3 = generateRandomUser();
      const userId2 = await createUser(userData2);
      const userId3 = await createUser(userData3);

      const authorData1 = generateRandomAuthor();
      const authorData2 = generateRandomAuthor();
      const authorId1 = await createAuthor(authorData1);
      const authorId2 = await createAuthor(authorData2);

      const alternativeData1 = await generateRandomBookAlternative();
      const alternativeData2 = await generateRandomBookAlternative();
      const [alternativeId1, alternativeId2] = await createBookAlternatives([alternativeData1, alternativeData2]);

      const bookData1 = generateRandomBook({ authorIds: [authorId1], alternativeIds: [alternativeId1] });
      const bookData2 = generateRandomBook({ authorIds: [authorId2], alternativeIds: [alternativeId2] });
      await setBooks([bookData1, bookData2]);

      const bookListData = await generateRandomBookList({ juryIds: [userId, userId2, userId3], bookIds: [bookData1.id, bookData2.id] });
      const year = bookListData.year;
      const genre = bookListData.genre;
      const bookListId = await createBookList(bookListData);

      const bookList = await getBookList({ year, genre });

      const expectedData = {
        bookList: {
          id: bookListId,
          ...bookListData
        },
        books: jasmine.arrayWithExactContents([
          { ...bookData1, authors: [{ id: authorId1, ...authorData1 }], alternatives: [{ id: alternativeId1, ...alternativeData1 }] },
          { ...bookData2, authors: [{ id: authorId2, ...authorData2 }], alternatives: [{ id: alternativeId2, ...alternativeData2 }] }
        ]),
        jury: jasmine.arrayWithExactContents([ 
          { id: userId, ...userData }, 
          { id: userId2, ...userData2 }, 
          { id: userId3, ...userData3 } 
        ])
      };

      expect(bookList).toEqual(expectedData);
    }));
  });
});
