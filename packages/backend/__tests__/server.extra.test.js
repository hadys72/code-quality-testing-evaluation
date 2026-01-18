// packages/backend/__tests__/server.extra.test.js

jest.mock('../src/middleware/auth', () => (req, _res, next) => next());

jest.mock('../src/controllers/userController', () => ({
  loginUser: (req, res) => res.status(200).json({ token: 't' }),
  registerUser: (req, res) => res.status(201).json({ token: 't' }),
  getAllUsers: (req, res) => res.status(200).json([{ id: 1 }]),
  findSimilarUsernames: (req, res) => res.status(200).json([]),
}));

jest.mock('../src/controllers/productController', () => ({
  getAllProducts: (req, res) => res.status(200).json({ data: [{ id: 1 }] }),
  createProduct: (req, res) => res.status(201).json({ id: 1, ...req.body }),
  getProduct: (req, res) => res.status(200).json({ data: { id: 1 } }),
  updateStock: (req, res) => res.status(200).json({ success: true }),
}));

const request = require('supertest');

const app = require('../src/server');

describe('server extra', () => {
  test('unknown route returns 404', async () => {
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.status).toBe(404);
  });

  test('json body parsing works on a known route', async () => {
    // product routes are under /api according to your server.js
    const res = await request(app).post('/api/products').send({ name: 'X', price: 1, stock: 1 });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, name: 'X', price: 1, stock: 1 });
  });

  test('auth routes are mounted under /api/auth', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'u', password: 'p' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 't' });
  });
});
