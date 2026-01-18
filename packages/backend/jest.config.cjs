module.exports = {
  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.test.js'],

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/**/index.js', '!src/db/migrations/**'],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  coverageThreshold: {
    global: {
      statements: 80,
      branches: 60,
      functions: 70,
      lines: 80,
    },
  },
};
