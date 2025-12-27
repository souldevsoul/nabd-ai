/**
 * Tests for no-generic-placeholders rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-generic-placeholders');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-generic-placeholders', rule, {
  valid: [
    { code: '<input placeholder="Enter your email" />' },
    { code: '<input placeholder="Search products..." />' },
  ],
  invalid: [],
});
