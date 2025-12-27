/**
 * Tests for require-credential-on-file-agreement rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-credential-on-file-agreement');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-credential-on-file-agreement', rule, {
  valid: [
    // Non-subscription files should be ignored
    {
      code: '<div>Monthly plan $9.99/mo</div>',
      filename: 'about.tsx',
    },

    // Subscription page with proper consent and disclosure
    {
      code: `
        <div>
          <p>Monthly subscription $9.99/mo</p>
          <p>You will be charged automatically every month. Cancel anytime.</p>
          <input type="checkbox" name="saveCard" />
          <label>Save my card for future payments</label>
        </div>
      `,
      filename: 'subscription.tsx',
    },

    // Subscription with all required elements
    {
      code: `
        <div>
          <h2>Pro Plan - $29/month</h2>
          <p>Your card will be billed monthly. You can cancel anytime.</p>
          <Checkbox name="save-card" />
          <span>Save payment method for recurring billing</span>
        </div>
      `,
      filename: 'checkout.tsx',
    },

    // Non-subscription payment (one-time)
    {
      code: '<div>Pay $50 now</div>',
      filename: 'payment.tsx',
    },
  ],

  invalid: [
    // Subscription page missing save card consent
    {
      code: `
        <div>
          <p>Monthly subscription $9.99/mo</p>
          <p>You will be charged automatically every month.</p>
        </div>
      `,
      filename: 'subscription.tsx',
      errors: [{ messageId: 'missingSaveCardConsent' }],
    },

    // Subscription page missing recurring disclosure
    {
      code: `
        <div>
          <p>Pro Plan - $29/month</p>
          <input type="checkbox" name="saveCard" />
          <label>Save my card</label>
        </div>
      `,
      filename: 'billing.tsx',
      errors: [{ messageId: 'missingRecurringDisclosure' }],
    },
  ],
});

console.log('✅ require-credential-on-file-agreement: All tests passed');
