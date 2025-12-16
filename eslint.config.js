const js = require('@eslint/js')
const globals = require('globals')

const perfectionist = require('eslint-plugin-perfectionist')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const n = require('eslint-plugin-n')
const unicorn = require('eslint-plugin-unicorn')

const prettier = require('eslint-config-prettier')

module.exports = [
  // Fichiers ignorés
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**']
  },

  // Règles JavaScript de base
  js.configs.recommended,

  // Configuration pour ce fichier (Node.js)
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },

  // =====================
  // Backend (Node.js)
  // =====================
  {
    files: ['packages/backend/**/*.js'],
    languageOptions: {
      globals: { ...globals.node }
    },
    plugins: {
      n,
      unicorn,
      perfectionist
    },
    rules: {
      // Node
      'n/no-missing-import': 'off',
      'n/no-process-exit': 'off',

      // Unicorn (assoupli)
      'unicorn/prefer-module': 'off',
      'unicorn/no-null': 'off',

      // Variables non utilisées (_next autorisé)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Tri des imports
      'perfectionist/sort-imports': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-imports': ['error', { order: 'asc' }],
      'perfectionist/sort-exports': ['error', { order: 'asc' }]
    }
  },

  // =====================
  // Frontend (React)
  // =====================
  {
    files: ['packages/frontend/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      perfectionist
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibilité (base)
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',

      // IMPORTANT : pas de no-unused-vars en frontend
      'no-unused-vars': 'off',

      // Tri des imports
      'perfectionist/sort-imports': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-imports': ['error', { order: 'asc' }],
      'perfectionist/sort-exports': ['error', { order: 'asc' }]
    }
  },

  // Compatibilité Prettier
  prettier
]
