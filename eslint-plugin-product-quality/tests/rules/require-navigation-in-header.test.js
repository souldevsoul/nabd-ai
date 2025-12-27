/**
 * Tests for require-navigation-in-header rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-navigation-in-header');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-navigation-in-header', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
