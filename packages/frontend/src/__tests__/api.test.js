import axios from 'axios';

import {
  createProduct,
  getProducts,
  getUsers,
  loginUser,
  logout,
  registerUser,
} from '../services/api';

jest.mock('axios');

describe('services/api', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('loginUser stores token and user in localStorage', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'token123', user: { id: 1, username: 'bapti' } },
    });

    const data = await loginUser('bapti', 'secret');

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/auth/login', {
      username: 'bapti',
      password: 'secret',
    });
    expect(localStorage.getItem('token')).toBe('token123');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, username: 'bapti' });
    expect(data).toEqual({ token: 'token123', user: { id: 1, username: 'bapti' } });
  });

  test('loginUser throws error.response.data when request fails', async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: 'Bad credentials' } },
    });

    await expect(loginUser('bad', 'wrong')).rejects.toEqual({ error: 'Bad credentials' });
  });

  test('registerUser stores token in localStorage', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'regtoken', user: { id: 2 } },
    });

    const payload = { username: 'new', password: 'pw' };
    const data = await registerUser(payload);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/auth/register', payload);
    expect(localStorage.getItem('token')).toBe('regtoken');
    expect(data).toEqual({ token: 'regtoken', user: { id: 2 } });
  });

  test('getUsers sends Authorization header and returns data', async () => {
    localStorage.setItem('token', 'token123');
    axios.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

    const users = await getUsers();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/auth/users', {
      headers: { Authorization: 'Bearer token123' },
    });
    expect(users).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('createProduct sends Authorization header and returns response.data', async () => {
    localStorage.setItem('token', 'token123');
    axios.post.mockResolvedValue({ data: { ok: true } });

    const productData = { name: 'A', price: 10 };
    const res = await createProduct(productData);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/products', productData, {
      headers: { Authorization: 'Bearer token123' },
    });
    expect(res).toEqual({ ok: true });
  });

  test('logout clears token and user', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    logout();

    expect(localStorage.getItem('token')).toBe(null);
    expect(localStorage.getItem('user')).toBe(null);
  });

  test('getProducts returns processed products with isCheapest and moreExpensiveCount', async () => {
    localStorage.setItem('token', 'token123');

    axios.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: 'A', price: 10 },
          { id: 2, name: 'B', price: 5 },
          { id: 3, name: 'C', price: 20 },
        ],
      },
    });

    const products = await getProducts();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/products', {
      headers: { Authorization: 'Bearer token123' },
    });

    const cheapest = products.find((p) => p.price === 5);
    expect(cheapest.isCheapest).toBe(true);
    expect(cheapest.moreExpensiveCount).toBe(2);

    const notCheapest = products.find((p) => p.price === 10);
    expect(notCheapest.isCheapest).toBe(false);
  });

  test('getProducts returns [] when axios.get fails', async () => {
    localStorage.setItem('token', 'token123');
    jest.spyOn(console, 'error').mockImplementation(() => {});

    axios.get.mockRejectedValue(new Error('network'));

    const products = await getProducts();
    expect(products).toEqual([]);

    console.error.mockRestore();
  });
});
