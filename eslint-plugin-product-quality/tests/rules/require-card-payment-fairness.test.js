/**
 * Tests for require-card-payment-fairness rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-card-payment-fairness');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-card-payment-fairness', rule, {
  valid: [
    // Non-payment files should be ignored
    {
      code: '<p>Minimum purchase $10 for card payments</p>',
      filename: 'about.tsx',
    },

    // Normal payment content without limits
    {
      code: '<div>We accept all major credit cards</div>',
      filename: 'checkout.tsx',
    },

    // Payment component without min/max props
    {
      code: '<PaymentForm amount={100} currency="USD" />',
      filename: 'payment.tsx',
    },

    // Generic minimum not related to cards
    {
      code: '<p>Minimum age requirement: 18</p>',
      filename: 'checkout.tsx',
    },

    // Maximum not related to transactions
    {
      code: '<p>Maximum file size: 10MB</p>',
      filename: 'payment.tsx',
    },
  ],

  invalid: [
    // Minimum transaction text
    {
      code: '<p>Minimum purchase $10 for card payments</p>',
      filename: 'checkout.tsx',
      errors: [{ messageId: 'minTransactionLimit' }],
    },

    // Credit card minimum
    {
      code: '<span>Credit card minimum: $5</span>',
      filename: 'payment.tsx',
      errors: [{ messageId: 'minTransactionLimit' }],
    },

    // Maximum transaction
    {
      code: '<div>Maximum card transaction: $500</div>',
      filename: 'checkout.tsx',
      errors: [{ messageId: 'maxTransactionLimit' }],
    },

    // Transaction limit
    {
      code: '<p>Transaction limit: $1000</p>',
      filename: 'billing.tsx',
      errors: [{ messageId: 'maxTransactionLimit' }],
    },

    // minAmount prop on payment component
    {
      code: '<PaymentForm minAmount={10} />',
      filename: 'checkout.tsx',
      errors: [{ messageId: 'minAmountProp' }],
    },

    // maxAmount prop on payment component
    {
      code: '<CardPayment maxAmount={500} />',
      filename: 'payment.tsx',
      errors: [{ messageId: 'maxAmountProp' }],
    },

    // String literal with minimum
    {
      code: 'const msg = "Minimum order $15 for credit card";',
      filename: 'checkout.tsx',
      errors: [{ messageId: 'minTransactionLimit' }],
    },

    // Debit card minimum
    {
      code: '<p>Debit card minimum $20</p>',
      filename: 'cart.tsx',
      errors: [{ messageId: 'minTransactionLimit' }],
    },
  ],
});

console.log('✅ require-card-payment-fairness: All tests passed');
