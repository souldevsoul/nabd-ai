/**
 * Tests for no-positive-tabindex rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-positive-tabindex');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-positive-tabindex', rule, {
  valid: [
    // tabIndex={0} is valid - natural tab order
    {
      code: '<button tabIndex={0}>Click me</button>',
      filename: 'test.jsx',
    },

    // tabIndex={-1} is valid - programmatic focus only
    {
      code: '<div tabIndex={-1}>Focusable by script</div>',
      filename: 'test.jsx',
    },

    // No tabIndex is fine
    {
      code: '<button>Natural button</button>',
      filename: 'test.jsx',
    },

    // String "0" is valid
    {
      code: '<input tabIndex="0" />',
      filename: 'test.jsx',
    },

    // String "-1" is valid
    {
      code: '<div tabIndex="-1">Modal content</div>',
      filename: 'test.jsx',
    },

    // Test files are skipped
    {
      code: '<button tabIndex={5}>Test</button>',
      filename: 'component.test.jsx',
    },
    {
      code: '<button tabIndex={5}>Test</button>',
      filename: '__tests__/button.jsx',
    },

    // Non-JSX files
    {
      code: 'const tabIndex = 5;',
      filename: 'test.js',
    },

    // Object property with valid value
    {
      code: 'const props = { tabIndex: 0 };',
      filename: 'test.js',
    },
    {
      code: 'const props = { tabIndex: -1 };',
      filename: 'test.js',
    },
  ],

  invalid: [
    // Positive tabIndex={1}
    {
      code: '<button tabIndex={1}>First</button>',
      filename: 'test.jsx',
      errors: [{ messageId: 'noPositiveTabindex', data: { value: '1' } }],
      output: '<button tabIndex={0}>First</button>',
    },

    // Positive tabIndex={5}
    {
      code: '<input tabIndex={5} />',
      filename: 'test.jsx',
      errors: [{ messageId: 'noPositiveTabindex', data: { value: '5' } }],
      output: '<input tabIndex={0} />',
    },

    // Positive tabIndex={100}
    {
      code: '<div tabIndex={100}>Very high</div>',
      filename: 'test.jsx',
      errors: [{ messageId: 'noPositiveTabindex', data: { value: '100' } }],
      output: '<div tabIndex={0}>Very high</div>',
    },

    // String positive value "3"
    {
      code: '<a tabIndex="3" href="#">Link</a>',
      filename: 'test.jsx',
      errors: [{ messageId: 'noPositiveTabindex', data: { value: '3' } }],
      output: '<a tabIndex={0} href="#">Link</a>',
    },

    // Object property with positive value
    {
      code: 'const props = { tabIndex: 2 };',
      filename: 'test.js',
      errors: [{ messageId: 'noPositiveTabindex', data: { value: '2' } }],
    },

    // TSX files
    {
      code: '<button tabIndex={10}>TSX</button>',
      filename: 'component.tsx',
      errors: [{ messageId: 'noPositiveTabindex', data: { value: '10' } }],
      output: '<button tabIndex={0}>TSX</button>',
    },
  ],
});

console.log('no-positive-tabindex: All tests passed!');
