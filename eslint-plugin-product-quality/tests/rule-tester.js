/**
 * ESLint RuleTester configuration for AutoQA plugin tests
 *
 * @version 1.0.0
 */

const { RuleTester } = require('eslint');

// Configure RuleTester for JSX/TSX support
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

module.exports = { ruleTester };
