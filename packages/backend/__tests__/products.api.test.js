// packages/backend/__tests__/products.api.test.js

// ⚠️ IMPORTANT : mocks AVANT le require du serveur

jest.mock('../src/controllers/productController', () => ({
  getAllProducts: (req, res) => res.status(200).json({ data: [{ id: 1, name: 'P' }] }),

  createProduct: (req, res) => res.status(201).json({ id: 1, ...req.body }),

  getProduct: (req, res) => res.status(200).json({ data: { id: 1 } }),

  updateStock: (req, res) => res.status(200).json({ success: true }),
}));

// On mock auth pour bypass le JWT
jest.mock('../src/middleware/auth', () => (req, _res, next) => next());

const request = require('supertest');

const app = require('../src/server');

describe('products API', () => {
  test('GET /api/products', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [{ id: 1, name: 'P' }] });
  });

  test('POST /api/products', async () => {
    const res = await request(app).post('/api/products').send({ name: 'X', price: 10, stock: 2 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 1,
      name: 'X',
      price: 10,
      stock: 2,
    });
  });
});
