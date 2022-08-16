const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  test('unauthenticated requests are denied', () =>
    request(app).put('/v1/fragments/randomid').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments/randomid')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users update a plain text fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is updated fragment');

    const body = JSON.parse(putRes.text);

    expect(putRes.statusCode).toBe(201);
    expect(body.status).toBe('ok');
    expect(body.fragment.type).toMatch(/text\/plain+/);
    expect(body.fragment.size).toEqual(24);

    const fragment = JSON.parse(putRes.text).fragment;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user2@email.com', 'password2');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment).toEqual(fragment);
  });

  test('return 404 if no id found', async () => {
    const putRes = await request(app)
      .put('/v1/fragments/randomid')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is updated fragment');

    expect(putRes.statusCode).toBe(404);
  });

  test('authenticated users create a plain text fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/markdown')
      .send('# This is updated fragment');

    expect(putRes.statusCode).toBe(400);
  });
});
