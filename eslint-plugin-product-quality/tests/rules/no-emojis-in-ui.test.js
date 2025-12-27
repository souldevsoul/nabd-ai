/**
 * Tests for no-emojis-in-ui rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-emojis-in-ui');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('no-emojis-in-ui', rule, {
  valid: [
    // No emojis
    { code: '<div>Welcome to our app</div>' },
    { code: 'const title = "Getting Started";' },
    { code: '<Button>Submit</Button>' },
    { code: 'const message = "Success! Your order is confirmed.";' },
  ],

  invalid: [
    // Emojis in JSX text - auto-fix removes emojis
    {
      code: '<div>Hello 👋 World</div>',
      output: '<div>Hello World</div>',
      errors: [{ messageId: 'noEmojis' }],
    },
    {
      code: '<Button>Save ✓</Button>',
      output: '<Button>Save</Button>',
      errors: [{ messageId: 'noEmojis' }],
    },
    // Emojis in JSX attributes - auto-fix removes emojis
    {
      code: '<div title="Welcome! 🎉">Hello</div>',
      output: '<div title="Welcome!">Hello</div>',
      errors: [{ messageId: 'noEmojis' }],
    },
  ],
});

console.log('no-emojis-in-ui: All tests passed!');
