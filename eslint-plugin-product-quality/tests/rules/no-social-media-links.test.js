/**
 * Tests for no-social-media-links rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-social-media-links');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-social-media-links', rule, {
  valid: [
    { code: '<a href="/about">About us</a>' },
    { code: '<a href="https://example.com">Our website</a>' },
  ],
  invalid: [],
});
