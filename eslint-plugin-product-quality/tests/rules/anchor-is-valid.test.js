/**
 * Tests for anchor-is-valid rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/anchor-is-valid');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('anchor-is-valid', rule, {
  valid: [
    // Valid href
    { code: '<a href="/page">Link</a>' },
    // External link
    { code: '<a href="https://example.com">External</a>' },
    // Hash with section (valid for in-page nav)
    { code: '<a href="#section">Jump to section</a>' },
    // Dynamic href (not checked)
    { code: '<a href={pageUrl}>Link</a>' },
    // Without onClick (just a styled element)
    { code: '<a>Styled text</a>' },
  ],

  invalid: [
    // Empty href with onClick
    {
      code: '<a href="" onClick={handleClick}>Click me</a>',
      errors: [{ messageId: 'invalidHref' }],
    },
    // Hash only with onClick
    {
      code: '<a href="#" onClick={handleClick}>Click</a>',
      errors: [{ messageId: 'invalidHref' }],
    },
    // javascript: protocol
    {
      code: '<a href="javascript:void(0)">Click</a>',
      errors: [{ messageId: 'javascriptVoid' }],
    },
    // javascript: with code
    {
      code: '<a href="javascript:doSomething()">Action</a>',
      errors: [{ messageId: 'javascriptVoid' }],
    },
    // No href but has onClick
    {
      code: '<a onClick={handleClick}>Click me</a>',
      errors: [{ messageId: 'noHref' }],
    },
  ],
});

console.log('anchor-is-valid: All tests passed!');
