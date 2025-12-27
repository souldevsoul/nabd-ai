/**
 * Tests for require-physical-address-checkout rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-physical-address-checkout');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-physical-address-checkout', rule, {
  valid: [
    { code: '<div><address>Merchant Location: 123 Street</address></div>', filename: '/app/checkout/page.tsx' },
    { code: '<div>Content</div>', filename: '/app/page.tsx' }, // Not checkout
  ],
  invalid: [
    { code: '<div>Checkout form</div>', filename: '/app/checkout/page.tsx', errors: [{ messageId: 'missingMerchantAddress' }] },
  ],
});
