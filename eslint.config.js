const js = require('@eslint/js');
const globals = require('globals');

const perfectionist = require('eslint-plugin-perfectionist');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const n = require('eslint-plugin-n');
const unicorn = require('eslint-plugin-unicorn');

const prettier = require('eslint-config-prettier');

module.exports = [
  // =====================
  // Ignored files
  // =====================
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**'],
  },

  // =====================
  // Base JS rules
  // =====================
  js.configs.recommended,

  // =====================
  // ESLint config file (this file)
  // =====================
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
  },

  // =====================
  // Backend (Node.js)
  // =====================
  {
    files: ['packages/backend/**/*.js'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
    plugins: {
      n,
      unicorn,
      perfectionist,
    },
    rules: {
      // Ces règles cassent souvent sur Jest/monorepo -> on les coupe
      'n/no-missing-require': 'off',
      'n/no-missing-import': 'off',

      'n/no-process-exit': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-null': 'off',

      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      'perfectionist/sort-imports': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-imports': ['error', { order: 'asc' }],
      'perfectionist/sort-exports': ['error', { order: 'asc' }],
    },
  },

  // =====================
  // Backend tests (Jest)
  // =====================
  {
    files: [
      // Ton repo montre packages/backend/__tests__/...
      'packages/backend/__tests__/**/*.js',
      // Et au cas où tu ajoutes des tests ailleurs
      'packages/backend/**/*.test.js',
      'packages/backend/**/*.spec.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
    rules: {
      // Sécurité: ces règles cassent souvent sur les chemins de tests/mocks
      'n/no-missing-require': 'off',
      'n/no-missing-import': 'off',
    },
  },

  // =====================
  // Frontend (React)
  // =====================
  {
    files: ['packages/frontend/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      perfectionist,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',

      // React a déjà ses règles; évite le double-signalement
      'no-unused-vars': 'off',

      'perfectionist/sort-imports': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-imports': ['error', { order: 'asc' }],
      'perfectionist/sort-exports': ['error', { order: 'asc' }],
    },
  },

  // =====================
  // Frontend tests & mocks (Jest)
  // =====================
  {
    files: [
      'packages/frontend/__tests__/**/*.{js,jsx}',
      'packages/frontend/**/__tests__/**/*.{js,jsx}',
      'packages/frontend/**/__mocks__/**/*.js',
      'packages/frontend/src/setupTests.js',
      'packages/frontend/**/*.test.{js,jsx}',
      'packages/frontend/**/*.spec.{js,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // =====================
  // Prettier compatibility
  // =====================
  prettier,
];
