/**
 * Tests for no-vat-number-display rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-vat-number-display');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('no-vat-number-display', rule, {
  valid: [
    // No VAT references
    { code: 'const company = "NewCo Ltd";' },
    { code: 'const reg = "Registration: 12345678";' },
    { code: '<div>Company Information</div>' },
    { code: 'const address = "123 Main Street";' },
  ],

  invalid: [
    // VAT number patterns
    {
      code: 'const vat = "VAT: GB123456789";',
      errors: [{ messageId: 'vatNumberDisplay' }],
    },
    {
      code: 'const vat = "DE123456789";',
      errors: [{ messageId: 'vatNumberDisplay' }],
    },
    // VAT labels
    {
      code: 'const label = "VAT Number:";',
      errors: [{ messageId: 'vatMention' }],
    },
    {
      code: '<span>Tax ID: 12345</span>',
      errors: [{ messageId: 'vatMention' }],
    },
  ],
});

console.log('no-vat-number-display: All tests passed!');
