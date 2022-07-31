//tests/unit/delete.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).delete(`/v1/fragments/1234`).expect(401));
  test('incorrect credentials are denied', () =>
    request(app)
      .post(`/v1/fragments/1234`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users can delete fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({
        body: 'Test123',
      });

    const id = await postRes.body.fragment.id;

    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.status).toBe('ok');
  });

  test('give error for non existent fragment', async () => {
    const res = await request(app).delete(`/v1/fragments/999`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(500);
  });
});
