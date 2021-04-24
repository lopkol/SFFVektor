'use strict';

const request = require('supertest');
const app = require('../../../app');

const { createAuthorizationCookie } = require('../../../../../test-helpers/authorization');
const { createUser } = require('../../../dao/users/users');
const { createAuthor, getAuthorById } = require('../../../dao/authors/authors');
const { clearCollection } = require('../../../../../test-helpers/firestore');
const { generateRandomUser, generateRandomAuthor } = require('../../../../../test-helpers/generate-data');

describe('PATCH /authors/:authorId', () => {
  beforeEach(async () => {
    await Promise.all([
      clearCollection('users'),
      clearCollection('authors')
    ]);
  });

  it('responds with 401 if called without jwt', async () => {
    await request(app.listen())
      .patch('/api/authors/something')
      .expect(401);
  });

  it('responds with 403 if the user is not admin', async () => {
    const userData = generateRandomUser({ role: 'user' });
    const id = await createUser(userData);

    const author = generateRandomAuthor();
    const authorId = await createAuthor(author);

    const authorDataToUpdate = { name: 'new name' };

    await request(app.listen())
      .patch(`/api/authors/${authorId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'user' })])
      .send({ authorData: authorDataToUpdate })
      .expect(403);
  });

  it('responds with 404 if an author with the given id does not exist', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const authorData = generateRandomAuthor();
    const noId = 'bad ID';

    await request(app.listen())
      .patch(`/api/authors/${noId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ authorData })
      .expect(404);
  });

  it('updates the author and responds with 200 and the updated data if the current user is admin', async () => {
    const userData = generateRandomUser({ role: 'admin' });
    const id = await createUser(userData);

    const authorData = generateRandomAuthor();
    const authorId = await createAuthor(authorData);

    const dataToUpdate = { name: 'Harry Potter' };

    const response = await request(app.listen())
      .patch(`/api/authors/${authorId}`)
      .set('Cookie', [createAuthorizationCookie({ id, role: 'admin' })])
      .send({ authorData: dataToUpdate })
      .expect(200);

    const updatedAuthorData = response.body.authorData;
    const updatedAuthorInDb = await getAuthorById(authorId);

    const expectedAuthorData = { id: authorId, ...authorData, ...dataToUpdate };

    expect(updatedAuthorData).toEqual(expectedAuthorData);
    expect(updatedAuthorInDb).toEqual(expectedAuthorData);
  });
});
