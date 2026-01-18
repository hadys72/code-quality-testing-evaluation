const request = require('supertest');

const app = require('../src/server');

describe('Health check', () => {
  it('GET /api should return 404 (API reachable)', async () => {
    const response = await request(app).get('/api');

    expect(response.statusCode).toBe(404);
  });
});
