/**
 * Tests for consistent-payment-providers rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/consistent-payment-providers');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('consistent-payment-providers', rule, {
  valid: [
    { code: 'const provider = "stripe";', options: [{ provider: 'stripe' }] },
    { code: 'const provider = "paypal";', options: [{ provider: 'paypal' }] },
    { code: 'const providers = ["stripe", "paypal"];', options: [{ provider: ['stripe', 'paypal'] }] },
    { code: 'const css = "aspect-square";' }, // CSS class names should be ignored
    { code: 'const text = "Payment accepted";' }, // No provider mentioned
  ],
  invalid: [
    {
      code: 'const provider = "paypal";',
      options: [{ provider: 'stripe' }],
      errors: [{ messageId: 'inconsistentProvider' }],
    },
    {
      code: 'const text = "Pay with Stripe";',
      options: [{ provider: 'paypal' }],
      errors: [{ messageId: 'inconsistentProvider' }],
    },
  ],
});
