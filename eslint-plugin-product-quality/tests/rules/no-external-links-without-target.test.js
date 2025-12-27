/**
 * Tests for no-external-links-without-target rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-external-links-without-target');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-external-links-without-target', rule, {
  valid: [
    { code: '<a href="/about">About</a>' },
    { code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>' },
  ],
  invalid: [
    {
      code: '<a href="https://example.com">External</a>',
      output: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">External</a>',
      errors: [{ messageId: 'missingTarget' }]
    },
    {
      code: '<a href="https://example.com" target="_blank">External</a>',
      output: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">External</a>',
      errors: [{ messageId: 'missingRel' }]
    },
  ],
});
