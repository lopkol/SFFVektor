'use strict';

const request = require('supertest');
const app = require('../../../app');

const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { setBooks } = require('../../../dao/books/books');
const { createAuthor } = require('../../../dao/authors/authors');
const { createBookAlternative } = require('../../../dao/book-alternatives/book-alternatives');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { 
  generateRandomUser, 
  generateRandomAuthor, 
  generateRandomBookAlternative, 
  generateRandomBook 
} = require('../../../../../test-helpers/generate-data');

describe('GET /books/:year', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('books'),
      clearCollection('bookAlternatives'),
      clearCollection('authors')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .get('/api/books/2020')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .get('/api/books/2020')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('returns with 200 with the books from the given year if the user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const userId = await createUser(userData);

    const authorData1 = generateRandomAuthor();
    const authorData2 = generateRandomAuthor();
    const authorId1 = await createAuthor(authorData1);
    const authorId2 = await createAuthor(authorData2);

    const alternativeData1 = await generateRandomBookAlternative();
    const alternativeData2 = await generateRandomBookAlternative();
    const alternativeData3 = await generateRandomBookAlternative();
    const alternativeId1 = await createBookAlternative(alternativeData1);
    const alternativeId2 = await createBookAlternative(alternativeData2);
    const alternativeId3 = await createBookAlternative(alternativeData3);

    const year = '2020';

    const bookData0 = generateRandomBook({ year: '1999' });
    const bookData1 = generateRandomBook({ year, authorIds: [authorId1], alternativeIds: [alternativeId1] });
    const bookData2 = generateRandomBook({ year, authorIds: [authorId2], alternativeIds: [alternativeId2, alternativeId3] });
    await setBooks([bookData0, bookData1, bookData2]);

    const response = await request(app.listen())
      .get(`/api/books/${year}`)
      .set('Cookie', [createAuthorizationCookie({ id: userId, role: 'admin' })])
      .expect(200);

    const expectedData = {
      books: jasmine.arrayWithExactContents([
        { 
          ...bookData1, 
          authors: [{ id: authorId1, ...authorData1 }], 
          alternatives: [{ id: alternativeId1, ...alternativeData1 }] 
        },
        { 
          ...bookData2, 
          authors: [{ id: authorId2, ...authorData2 }], 
          alternatives: jasmine.arrayWithExactContents([
            { id: alternativeId2, ...alternativeData2 }, 
            { id: alternativeId3, ...alternativeData3 }
          ]) 
        }
      ]),
    };

    expect(response.body).toEqual(expectedData);
  });
});
