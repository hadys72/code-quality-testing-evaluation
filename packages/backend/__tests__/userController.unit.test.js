// packages/backend/__tests__/userController.unit.test.js

const mockDatabase = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
};

jest.mock('../src/db/database', () => ({
  getDb: () => mockDatabase,
}));

jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(),
  hashSync: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = require('../src/controllers/userController');
const db = require('../src/db/database');

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe('userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('getAllUsers returns list', () => {
    const database = db.getDb();
    database.all.mockImplementation((_sql, _params, cb) => cb(null, [{ id: 1 }]));

    const req = {};
    const res = mockRes();

    userController.getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test('getAllUsers returns 500 on db error', () => {
    const database = db.getDb();
    database.all.mockImplementation((_sql, _params, cb) => cb(new Error('db fail')));

    const req = {};
    const res = mockRes();

    userController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });

  test('loginUser returns 401 on wrong password', () => {
    const database = db.getDb();
    database.get.mockImplementation((_sql, _params, cb) =>
      cb(null, { id: 1, username: 'u', password: 'hashed' })
    );

    bcrypt.compareSync.mockReturnValue(false);

    const req = { body: { username: 'u', password: 'wrong' } };
    const res = mockRes();

    userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ auth: false }));
  });

  test('loginUser returns 200 + token on success', () => {
    const database = db.getDb();
    database.get.mockImplementation((_sql, _params, cb) =>
      cb(null, { id: 7, username: 'u', password: 'hashed' })
    );

    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue('token123');

    const req = { body: { username: 'u', password: 'ok' } };
    const res = mockRes();

    userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'token123' }));
  });

  test('loginUser returns 500 on db error', () => {
    const database = db.getDb();
    database.get.mockImplementation((_sql, _params, cb) => cb(new Error('db fail')));

    const req = { body: { username: 'u', password: 'p' } };
    const res = mockRes();

    userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });

  test('registerUser returns 201 + token (smoke)', () => {
    const database = db.getDb();

    bcrypt.hashSync.mockReturnValue('hashed');
    jwt.sign.mockReturnValue('tokenReg');

    database.run.mockImplementation(function (_sql, _params, cb) {
      cb.call({ lastID: 42 }, null);
    });

    const req = { body: { username: 'new', password: 'pwd' } };
    const res = mockRes();

    userController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tokenReg' }));
  });

  test('registerUser returns 500 on db error', () => {
    const database = db.getDb();

    bcrypt.hashSync.mockReturnValue('hashed');
    database.run.mockImplementation((_sql, _params, cb) => cb(new Error('insert fail')));

    const req = { body: { username: 'new', password: 'pwd' } };
    const res = mockRes();

    userController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });

  test('findSimilarUsernames returns array (smoke test)', () => {
    const database = db.getDb();
    database.all.mockImplementation((_sql, _params, cb) =>
      cb(null, [{ username: 'alex' }, { username: 'alec' }, { username: 'bob' }])
    );

    const req = {};
    const res = mockRes();

    userController.findSimilarUsernames(req, res);

    expect(res.json).toHaveBeenCalled();
  });
});
