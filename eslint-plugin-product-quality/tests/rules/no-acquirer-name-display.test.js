/**
 * Tests for no-acquirer-name-display rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-acquirer-name-display');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('no-acquirer-name-display', rule, {
  valid: [
    // No acquirer names
    { code: 'const payment = "Credit Card";' },
    { code: '<div>Secure payment</div>' },
    // Payment method buttons (allowed)
    { code: 'const btn = "Pay with PayPal";' },
    { code: '<Button>Checkout with PayPal</Button>' },
  ],

  invalid: [
    // Acquirer names in text
    {
      code: 'const footer = "Powered by Stripe";',
      errors: [{ messageId: 'acquirerNameDisplay' }],
    },
    {
      code: 'const info = "Payment processed by Adyen";',
      errors: [{ messageId: 'acquirerNameDisplay' }],
    },
    {
      code: '<span>Our payment processor is Worldpay</span>',
      errors: [{ messageId: 'acquirerNameDisplay' }],
    },
  ],
});

console.log('no-acquirer-name-display: All tests passed!');
