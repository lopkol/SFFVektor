'use strict';

const request = require('supertest');
const app = require('../../../app');
const { generateRandomUser, generateRandomBookList } = require('../../../../../test-helpers/generate-data');
const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser, getUsersByIds } = require('../../../dao/users/users');
const { createBookList, getBookListsOfJuryMember } = require('../../../dao/book-lists/book-lists');
const { clearCollection } = require('../../../../../test-helpers/firestore');

describe('PATCH /users/:userId', () => {
  beforeEach(async () => {
    await Promise.all([clearCollection('users'), clearCollection('bookLists')]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen()).patch('/api/users/something').expect(401);
  });

  it('responds with 403 if the user is not admin and trying to update the account of someone else', async () => {
    const userData = generateRandomUser({ role: 'user', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const otherUserData = generateRandomUser({ email: 'b@gmail.com' });
    const otherId = await createUser(otherUserData);

    await request(app.listen())
      .patch(`/api/users/${otherId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ userData: { molyUsername: 'Jancsi' } })
      .expect(403);
  });

  it('responds with 404 if a user with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const newUserData = generateRandomUser();
    const noId = id + '1234';

    await request(app.listen())
      .patch(`/api/users/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: newUserData })
      .expect(404);
  });

  it('updates user and responds with 200 and the updated user data if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const otherUserData = generateRandomUser({ role: 'user', email: 'b@gmail.com' });
    const otherId = await createUser(otherUserData);

    const dataToUpdate = { role: 'admin', molyUsername: 'cica' };

    const response = await request(app.listen())
      .patch(`/api/users/${otherId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: dataToUpdate })
      .expect(200);

    const updatedUserData = response.body.userData;
    const [updatedUserInDb] = await getUsersByIds([otherId]);

    const expectedUserData = { id: otherId, ...otherUserData, ...dataToUpdate };

    expect(updatedUserData).toEqual(expectedUserData);
    expect(updatedUserInDb).toEqual(expectedUserData);
  });

  it('also updates the book lists of the user', async () => {
    const userData = generateRandomUser({ role: 'admin', email: 'a@gmail.com' });
    const id = await createUser(userData);

    const otherUserData = generateRandomUser({ role: 'user', email: 'b@gmail.com' });
    const otherId = await createUser(otherUserData);

    const bookListData1 = generateRandomBookList({ year: 2020, juryIds: [otherId] });
    const bookListData2 = generateRandomBookList({ year: 2019 });

    await createBookList(bookListData1);
    const bookListId2 = await createBookList(bookListData2);

    const dataToUpdate = { role: 'admin', molyUsername: 'cica', bookListIds: [bookListId2] };

    await request(app.listen())
      .patch(`/api/users/${otherId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ userData: dataToUpdate })
      .expect(200);

    const bookLists = await getBookListsOfJuryMember(otherId);
    const bookListIds = bookLists.map(bookList => bookList.id);
    expect(bookListIds).toEqual(jasmine.arrayWithExactContents([bookListId2]));
  });

  it('updates user and responds with 200 and the updated data if the user is updating his own account (not his role)', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const dataToUpdate = { molyUsername: 'unikornis' };

    const response = await request(app.listen())
      .patch(`/api/users/${id}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ userData: dataToUpdate })
      .expect(200);

    const updatedUserData = response.body.userData;
    const [updatedUserInDb] = await getUsersByIds([id]);

    const expectedUserData = { id, ...userData, ...dataToUpdate };

    expect(updatedUserData).toEqual(expectedUserData);
    expect(updatedUserInDb).toEqual(expectedUserData);
  });

  it('responds with 403 if a (non-admin) user tries to update his own role', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const dataToUpdate = { role: 'admin' };

    await request(app.listen())
      .patch(`/api/users/${id}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ userData: dataToUpdate })
      .expect(403);
  });
});
