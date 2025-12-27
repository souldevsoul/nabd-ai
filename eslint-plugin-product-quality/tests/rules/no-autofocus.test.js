/**
 * Tests for no-autofocus rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-autofocus');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-autofocus', rule, {
  valid: [
    // No autofocus
    { code: '<input type="text" />' },
    { code: '<input type="email" placeholder="Enter email" />' },
    { code: '<textarea placeholder="Message"></textarea>' },
    { code: '<button>Click me</button>' },

    // With allowInModals option
    {
      code: '<Modal><input autoFocus /></Modal>',
      options: [{ allowInModals: true }],
    },
    {
      code: '<div role="dialog"><input autoFocus /></div>',
      options: [{ allowInModals: true }],
    },
    {
      code: '<Dialog><button autoFocus>Close</button></Dialog>',
      options: [{ allowInModals: true }],
    },

    // With allowInSearch option
    {
      code: '<input type="search" autoFocus />',
      options: [{ allowInSearch: true }],
    },
    {
      code: '<SearchInput autoFocus />',
      options: [{ allowInSearch: true }],
    },
    {
      code: '<div role="search"><input autoFocus /></div>',
      options: [{ allowInSearch: true }],
    },
  ],

  invalid: [
    // Basic autofocus violations
    {
      code: '<input autoFocus />',
      errors: [{ messageId: 'noAutofocus' }],
    },
    {
      code: '<input autofocus />',
      errors: [{ messageId: 'noAutofocus' }],
    },
    {
      code: '<textarea autoFocus></textarea>',
      errors: [{ messageId: 'noAutofocus' }],
    },
    {
      code: '<button autoFocus>Submit</button>',
      errors: [{ messageId: 'noAutofocus' }],
    },
    {
      code: '<input type="text" autoFocus placeholder="Name" />',
      errors: [{ messageId: 'noAutofocus' }],
    },

    // In modal without option
    {
      code: '<Modal><input autoFocus /></Modal>',
      errors: [{ messageId: 'noAutofocus' }],
    },

    // Search without option
    {
      code: '<input type="search" autoFocus />',
      errors: [{ messageId: 'noAutofocus' }],
    },

    // autoFocus with value
    {
      code: '<input autoFocus={true} />',
      errors: [{ messageId: 'noAutofocus' }],
    },
  ],
});

console.log('no-autofocus: All tests passed!');
