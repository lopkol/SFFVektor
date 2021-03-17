'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookList } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser, getUsersByIds } = require('../../../dao/users/users');
const { createBookList, getBookListsOfJuryMember } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('POST /users/new', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('bookLists')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .post('/api/users/new')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    await request(app.listen())
      .post('/api/users/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .expect(403);
  });

  it('creates a new user and responds with 201 and the user id if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const newUserData = generateRandomUser({ email: 'b@gmail.com' });

    const response = await request(app.listen())
      .post('/api/users/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: newUserData })
      .expect(201);

    const newId = response.body.id;
    const [savedUser] = await getUsersByIds([newId]);
    expect(savedUser).toEqual({ id: newId, ...newUserData });
  });

  it('creates a new user and also adds him to the given book lists', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const bookListData1 = generateRandomBookList({ year: 2020 });
    const bookListData2 = generateRandomBookList({ year: 2019 });

    const bookListId1 = await createBookList(bookListData1);
    const bookListId2 = await createBookList(bookListData2);

    const newUserData = generateRandomUser({ email: 'b@gmail.com', bookListIds: [bookListId1, bookListId2] });

    const response = await request(app.listen())
      .post('/api/users/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: newUserData })
      .expect(201);

    const newId = response.body.id;

    const bookLists = await getBookListsOfJuryMember(newId);
    const bookListIds = bookLists.map(bookList => bookList.id);
    expect(bookListIds).toEqual(jasmine.arrayWithExactContents([bookListId1, bookListId2]));
  });

  it('responds with 409 if a user with the given email address already exists', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'unicorn@gmail.com' });
    const id = await createUser(userData);

    const newUserData = generateRandomUser({ email: 'unicorn@gmail.com' });

    await request(app.listen())
      .post('/api/users/new')
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: newUserData })
      .expect(409);
  });
});
