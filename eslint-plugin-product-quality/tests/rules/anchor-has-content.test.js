/**
 * Tests for anchor-has-content rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/anchor-has-content');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('anchor-has-content', rule, {
  valid: [
    // Text content
    { code: '<a href="/page">Click here</a>' },
    // With aria-label
    { code: '<a href="/page" aria-label="Go to page"><Icon /></a>' },
    // With aria-labelledby
    { code: '<a href="/page" aria-labelledby="label-id"><Icon /></a>' },
    // With title
    { code: '<a href="/page" title="Go to page"><Icon /></a>' },
    // Link component with text
    { code: '<Link href="/page">Home</Link>' },
    // Nested text in span
    { code: '<a href="/page"><span>Link text</span></a>' },
  ],

  invalid: [
    // Empty anchor
    {
      code: '<a href="/page"></a>',
      errors: [{ messageId: 'noContent' }],
    },
    // Only whitespace
    {
      code: '<a href="/page">   </a>',
      errors: [{ messageId: 'noContent' }],
    },
    // Empty Link
    {
      code: '<Link href="/page"></Link>',
      errors: [{ messageId: 'noContent' }],
    },
  ],
});

console.log('anchor-has-content: All tests passed!');
