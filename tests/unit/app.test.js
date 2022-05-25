// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('app.js check', () => {
  test('should return HTTP 404 response', () => request(app).get('/404').expect(404));
});
