/**
 * Tests for require-aria-label-on-icon-buttons rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-aria-label-on-icon-buttons');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-aria-label-on-icon-buttons', rule, {
  valid: [
    { code: '<button aria-label="Close menu"><CloseIcon /></button>' },
    { code: '<button>Submit</button>' }, // Has text child
    { code: '<Button aria-labelledby="label-id"><SearchIcon /></Button>' },
  ],
  invalid: [
    {
      code: '<button><MenuIcon /></button>',
      output: '<button aria-label="Button"><MenuIcon /></button>',
      errors: [{ messageId: 'missingAriaLabel' }],
    },
    {
      code: '<Button><CloseIcon /></Button>',
      output: '<Button aria-label="Button"><CloseIcon /></Button>',
      errors: [{ messageId: 'missingAriaLabel' }],
    },
  ],
});
