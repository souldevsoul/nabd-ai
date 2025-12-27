/**
 * Tests for no-unsafe-regex rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-unsafe-regex');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-unsafe-regex', rule, {
  valid: [
    // Simple regex patterns are fine
    { code: 'const re = /abc/;' },
    { code: 'const re = /[a-z]+/;' },
    { code: 'const re = /\\d{3}-\\d{4}/;' },
    { code: 'const re = /^hello$/;' },

    // RegExp constructor with safe pattern
    { code: 'const re = new RegExp("abc");' },
    { code: 'const re = new RegExp("[0-9]+");' },

    // Test files are skipped
    {
      code: 'const re = /(.+)+/;',
      filename: '/tests/example.test.js',
    },
    {
      code: 'const re = /(a+)+/;',
      filename: '/src/__tests__/helper.js',
    },

    // Variables without user input context
    { code: 'const pattern = getSafePattern(); const re = new RegExp(pattern);' },
  ],

  invalid: [
    // Nested quantifiers in regex literal
    {
      code: 'const re = /(a+)+/;',
      errors: [{ messageId: 'nestedQuantifier' }],
    },
    {
      code: 'const re = /(a*)+/;',
      errors: [{ messageId: 'nestedQuantifier' }],
    },
    {
      code: 'const re = /(.+)+/;',
      errors: [{ messageId: 'nestedQuantifier' }],
    },
    {
      code: 'const re = /(.*)+/;',
      errors: [{ messageId: 'nestedQuantifier' }],
    },

    // Nested quantifiers in RegExp constructor
    {
      code: 'const re = new RegExp("(a+)+");',
      errors: [{ messageId: 'nestedQuantifier' }],
    },
    {
      code: 'const re = RegExp("(.+)+");',
      errors: [{ messageId: 'nestedQuantifier' }],
    },

    // Known dangerous patterns
    {
      code: 'const re = /(.*)*test/;',
      errors: [{ messageId: 'nestedQuantifier' }],
    },
    {
      code: 'const re = new RegExp("([a-zA-Z]+)*");',
      errors: [{ messageId: 'nestedQuantifier' }],
    },

    // Multiple wildcards
    {
      code: 'const re = /.*.*match/;',
      errors: [{ messageId: 'unsafeRegex' }],
    },

    // Dynamic regex from user input
    {
      code: 'const re = new RegExp(req.query.pattern);',
      errors: [{ messageId: 'dynamicRegex' }],
    },
    {
      code: 'const re = new RegExp(req.body.search);',
      errors: [{ messageId: 'dynamicRegex' }],
    },
    {
      code: 'const re = new RegExp(params.filter);',
      errors: [{ messageId: 'dynamicRegex' }],
    },
    {
      code: 'const re = new RegExp(userInput);',
      errors: [{ messageId: 'dynamicRegex' }],
    },
    {
      code: 'const re = new RegExp(searchTerm);',
      errors: [{ messageId: 'dynamicRegex' }],
    },

    // Overlapping alternations
    {
      code: 'const re = /(a|aa)+/;',
      errors: [{ messageId: 'unsafeRegex' }],
    },
  ],
});

console.log('no-unsafe-regex: All tests passed!');
