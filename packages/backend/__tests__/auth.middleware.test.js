// packages/backend/__tests__/auth.middleware.test.js

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');

const auth = require('../src/middleware/auth');

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe('auth middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('calls next when token valid', () => {
    jwt.verify.mockReturnValue({ id: 1 });

    const req = { headers: { authorization: 'Bearer token' } };
    const res = mockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('returns 401 if token invalid', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    const req = { headers: { authorization: 'Bearer token' } };
    const res = mockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401); // ✅ pas 403
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 if no token', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
