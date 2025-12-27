/**
 * Tests for require-discount-limits rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-discount-limits');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('require-discount-limits', rule, {
  valid: [
    // Valid discount percentages
    { code: 'const discount = "Save 3%";' },
    { code: 'const discount = "5% off";' },
    { code: 'const discount = "8% discount";' },
    { code: 'const discount = "12% off annual plan";' },
    { code: 'const discount = "Save 15%";' },
    // Not discount context
    { code: 'const progress = 50;' },
    { code: 'const width = 80;' }, // Not discount-related name
  ],

  invalid: [
    // Excessive discounts
    {
      code: 'const sale = "50% off!";',
      errors: [{ messageId: 'excessiveDiscount' }],
    },
    {
      code: 'const promo = "Save 70%";',
      errors: [{ messageId: 'excessiveDiscount' }],
    },
    {
      code: '<span>30% discount</span>',
      errors: [{ messageId: 'excessiveDiscount' }],
    },
    // Unusual discounts (warning)
    {
      code: 'const discount = "7% off";',
      errors: [{ messageId: 'unusualDiscount' }],
    },
  ],
});

console.log('require-discount-limits: All tests passed!');
