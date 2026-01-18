// packages/backend/__tests__/database.unit.test.js

// ⚠️ Jest hoist: toute variable utilisée dans jest.mock factory doit commencer par "mock"
const mockInitDatabase = jest.fn();

// on capture les appels au constructeur sqlite
const mockDatabaseCtor = jest.fn();

// instance DB retournée
const mockClose = jest.fn();
const mockDbInstance = { close: mockClose };

// fs mock fns
const mockExistsSync = jest.fn();
const mockStatSync = jest.fn();
const mockReaddirSync = jest.fn();

jest.mock('../src/db/migrations/init', () => mockInitDatabase);

jest.mock('fs', () => ({
  existsSync: (...args) => mockExistsSync(...args),
  statSync: (...args) => mockStatSync(...args),
  readdirSync: (...args) => mockReaddirSync(...args),
}));

jest.mock('sqlite3', () => {
  // ✅ IMPORTANT: doit être "constructible" (pas une arrow function)
  function MockDatabase(path, cb) {
    // on délègue le comportement au spy, qui retournera l'instance voulue
    return mockDatabaseCtor(path, cb);
  }

  return {
    verbose: () => ({
      Database: MockDatabase,
    }),
  };
});

describe('database.js', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // defaults
    mockExistsSync.mockReturnValue(false);
    mockInitDatabase.mockResolvedValue(undefined);

    mockClose.mockImplementation((cb) => (typeof cb === 'function' ? cb(null) : undefined));
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  test('getDb throws if not connected', () => {
    const dbModule = require('../src/db/database');
    expect(() => dbModule.getDb()).toThrow('Database not connected');
  });

  test('connect resolves and getDb returns same db instance', async () => {
    mockDatabaseCtor.mockImplementation((_path, cb) => {
      if (typeof cb === 'function') cb(null);
      return mockDbInstance;
    });

    const dbModule = require('../src/db/database');

    const db = await dbModule.connect();
    expect(db).toBe(mockDbInstance);

    const db2 = dbModule.getDb();
    expect(db2).toBe(mockDbInstance);

    expect(mockInitDatabase).toHaveBeenCalled();
  });

  test('connect returns existing db if already connected (no second constructor call)', async () => {
    mockDatabaseCtor.mockImplementation((_path, cb) => {
      if (typeof cb === 'function') cb(null);
      return mockDbInstance;
    });

    const dbModule = require('../src/db/database');

    const db1 = await dbModule.connect();
    const db2 = await dbModule.connect();

    expect(db1).toBe(mockDbInstance);
    expect(db2).toBe(mockDbInstance);
    expect(mockDatabaseCtor).toHaveBeenCalledTimes(1);
  });

  test('connect rejects and logs error if sqlite connection fails', async () => {
    mockDatabaseCtor.mockImplementation((_path, cb) => {
      if (typeof cb === 'function') cb(new Error('sqlite fail'));
      return mockDbInstance;
    });

    const dbModule = require('../src/db/database');

    await expect(dbModule.connect()).rejects.toThrow('sqlite fail');
    expect(console.error).toHaveBeenCalled();
  });

  test('connect rejects and logs error if initDatabase fails', async () => {
    mockDatabaseCtor.mockImplementation((_path, cb) => {
      if (typeof cb === 'function') cb(null);
      return mockDbInstance;
    });

    mockInitDatabase.mockRejectedValue(new Error('init fail'));

    const dbModule = require('../src/db/database');

    await expect(dbModule.connect()).rejects.toThrow('init fail');
    expect(console.error).toHaveBeenCalled();
  });

  test('closeConnection resolves immediately if not connected', async () => {
    const dbModule = require('../src/db/database');

    await expect(dbModule.closeConnection()).resolves.toBeUndefined();
    expect(mockClose).not.toHaveBeenCalled();
  });

  test('closeConnection closes db and resets internal state', async () => {
    mockDatabaseCtor.mockImplementation((_path, cb) => {
      if (typeof cb === 'function') cb(null);
      return mockDbInstance;
    });

    const dbModule = require('../src/db/database');

    await dbModule.connect();
    expect(dbModule.getDb()).toBe(mockDbInstance);

    await dbModule.closeConnection();
    expect(mockClose).toHaveBeenCalledTimes(1);

    expect(() => dbModule.getDb()).toThrow('Database not connected');
  });

  test('closeConnection rejects and logs error if close fails', async () => {
    mockDatabaseCtor.mockImplementation((_path, cb) => {
      if (typeof cb === 'function') cb(null);
      return mockDbInstance;
    });

    mockClose.mockImplementation((cb) =>
      typeof cb === 'function' ? cb(new Error('close fail')) : undefined
    );

    const dbModule = require('../src/db/database');

    await dbModule.connect();
    await expect(dbModule.closeConnection()).rejects.toThrow('close fail');
    expect(console.error).toHaveBeenCalled();
  });

  test('connect covers fs branch when database file exists', async () => {
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue({ size: 123 });
    mockReaddirSync.mockReturnValue(['x.js', 'y.js']);

    mockDatabaseCtor.mockImplementation((_path, cb) => {
      if (typeof cb === 'function') cb(null);
      return mockDbInstance;
    });

    const dbModule = require('../src/db/database');

    await dbModule.connect();

    expect(mockStatSync).toHaveBeenCalled();
    expect(mockReaddirSync).toHaveBeenCalled();
  });
});
