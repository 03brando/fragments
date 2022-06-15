// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users post a fragment with a correct location', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test test test');
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toEqual(
      `${process.env.API_URL}/v1/fragments/${JSON.parse(res.text).fragment.id}`
    );
  });

  test('415 error if a fragment has an unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('POST test fragment')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(415);
  });
});
