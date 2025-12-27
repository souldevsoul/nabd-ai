/**
 * Tests for require-currency-format rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-currency-format');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-currency-format', rule, {
  valid: [
    { code: 'const price = "€29.99 EUR";', filename: '/app/pricing/page.tsx' },
    { code: 'const price = "$50.00 USD";', filename: '/app/checkout/page.tsx' },
    { code: 'const price = "£19.99 GBP";', filename: '/app/payment/page.tsx' },
    { code: 'const text = "Hello";', filename: '/app/page.tsx' }, // Not pricing file
  ],
  invalid: [
    { code: 'const price = "€29.99";', filename: '/app/pricing/page.tsx', errors: [{ messageId: 'missingCurrencyCode' }] },
  ],
});
