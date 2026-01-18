// packages/backend/__tests__/users.api.test.js

// ⚠️ IMPORTANT : mocks AVANT le require du serveur

jest.mock('../src/controllers/userController', () => ({
  loginUser: (req, res) => res.status(200).json({ token: 't' }),
  registerUser: (req, res) => res.status(201).json({ token: 't' }),
  getAllUsers: (req, res) => res.status(200).json([{ id: 1 }]),
  findSimilarUsernames: (req, res) => res.status(200).json([]),
}));

// On mock auth pour bypass le JWT
jest.mock('../src/middleware/auth', () => (req, _res, next) => next());

const request = require('supertest');

const app = require('../src/server');

describe('users API', () => {
  test('POST /api/auth/login', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'u', password: 'p' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 't' });
  });

  test('GET /api/auth/users', async () => {
    const res = await request(app).get('/api/auth/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });
});
