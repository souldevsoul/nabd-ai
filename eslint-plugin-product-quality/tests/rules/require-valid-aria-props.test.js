/**
 * Tests for require-valid-aria-props rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-valid-aria-props');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-valid-aria-props', rule, {
  valid: [
    // Valid ARIA attributes
    {
      code: '<button aria-label="Close">X</button>',
      filename: 'test.jsx',
    },
    {
      code: '<div aria-hidden="true">Hidden content</div>',
      filename: 'test.jsx',
    },
    {
      code: '<input aria-describedby="help-text" />',
      filename: 'test.jsx',
    },
    {
      code: '<div aria-live="polite" aria-atomic="true">Updates</div>',
      filename: 'test.jsx',
    },
    {
      code: '<button aria-pressed="true">Toggle</button>',
      filename: 'test.jsx',
    },
    {
      code: '<div aria-expanded="false" aria-controls="menu">Menu</div>',
      filename: 'test.jsx',
    },
    {
      code: '<input aria-invalid="true" aria-errormessage="error-msg" />',
      filename: 'test.jsx',
    },
    {
      code: '<div role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" />',
      filename: 'test.jsx',
    },

    // Non-JSX files are skipped
    {
      code: 'const x = "aria-fake";',
      filename: 'test.js',
    },

    // Test files are skipped
    {
      code: '<div aria-fake="test" />',
      filename: 'component.test.jsx',
    },

    // Non-aria attributes are ignored
    {
      code: '<div data-testid="test" className="foo" />',
      filename: 'test.jsx',
    },
  ],

  invalid: [
    // Invalid/misspelled ARIA attributes
    {
      code: '<button aria-lable="Close">X</button>',
      filename: 'test.jsx',
      errors: [{ messageId: 'invalidAria', data: { name: 'aria-lable' } }],
    },
    {
      code: '<div aria-hiden="true">Hidden</div>',
      filename: 'test.jsx',
      errors: [{ messageId: 'invalidAria', data: { name: 'aria-hiden' } }],
    },
    {
      code: '<input aria-decribedby="help" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'invalidAria', data: { name: 'aria-decribedby' } }],
    },
    {
      code: '<div aria-fake="test" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'invalidAria', data: { name: 'aria-fake' } }],
    },
    {
      code: '<button aria-labelled="test" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'invalidAria', data: { name: 'aria-labelled' } }],
    },

    // TSX files are also checked
    {
      code: '<div aria-notreal="value" />',
      filename: 'component.tsx',
      errors: [{ messageId: 'invalidAria', data: { name: 'aria-notreal' } }],
    },
  ],
});

console.log('require-valid-aria-props: All tests passed!');
