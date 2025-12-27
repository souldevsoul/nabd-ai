/**
 * Tests for require-trust-signals rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-trust-signals');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-trust-signals', rule, {
  valid: [
    // Non-payment page
    {
      code: '<div>About us</div>',
      filename: 'about.tsx',
    },

    // Checkout with secure checkout text
    {
      code: `
        <div>
          <form>
            <input type="text" placeholder="Card number" />
          </form>
          <p>Secure checkout with SSL encryption</p>
        </div>
      `,
      filename: 'checkout.tsx',
    },

    // Payment page with guarantee
    {
      code: `
        <div>
          <h1>Complete Payment</h1>
          <p>30-day money back guarantee</p>
        </div>
      `,
      filename: 'payment.tsx',
    },

    // Billing page with cancel anytime
    {
      code: `
        <div>
          <p>Cancel anytime. No commitment.</p>
        </div>
      `,
      filename: 'billing.tsx',
    },

    // Checkout with lock icon component
    {
      code: `
        <div>
          <LockIcon />
          <span>Payment secured</span>
        </div>
      `,
      filename: 'checkout.tsx',
    },

    // Pricing page with trust badge class
    {
      code: `
        <div className="trust-badge">
          <span>Verified</span>
        </div>
      `,
      filename: 'pricing.tsx',
    },

    // Subscribe page with PCI compliance
    {
      code: `
        <div>
          <p>PCI DSS compliant payment processing</p>
        </div>
      `,
      filename: 'subscribe.tsx',
    },

    // Cart with security badge
    {
      code: `
        <div className="security-badge">
          <ShieldIcon />
        </div>
      `,
      filename: 'cart.tsx',
    },

    // API routes should be ignored
    {
      code: '<div>Webhook handler</div>',
      filename: 'api/payment/webhook.ts',
    },
  ],

  invalid: [
    // Checkout page without trust signals
    {
      code: `
        <div>
          <h1>Checkout</h1>
          <form>
            <input type="text" placeholder="Card number" />
            <button>Pay Now</button>
          </form>
        </div>
      `,
      filename: 'checkout.tsx',
      errors: [{ messageId: 'missingTrustSignals' }],
    },

    // Payment page without any trust indicators
    {
      code: `
        <div>
          <h1>Enter Payment Details</h1>
          <input placeholder="Credit card" />
          <button>Submit</button>
        </div>
      `,
      filename: 'payment.tsx',
      errors: [{ messageId: 'missingTrustSignals' }],
    },

    // Billing page without trust signals
    {
      code: `
        <div>
          <h1>Billing Information</h1>
          <form>
            <input name="card" />
          </form>
        </div>
      `,
      filename: 'billing/page.tsx',
      errors: [{ messageId: 'missingTrustSignals' }],
    },
  ],
});

console.log('✅ require-trust-signals: All tests passed');
