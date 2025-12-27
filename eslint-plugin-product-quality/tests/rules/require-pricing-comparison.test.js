/**
 * Tests for require-pricing-comparison rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-pricing-comparison');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-pricing-comparison', rule, {
  valid: [
    // Non-pricing page
    {
      code: '<div>About us</div>',
      filename: 'about.tsx',
    },

    // Pricing page with comparison table and popular badge
    {
      code: `
        <div>
          <h1>Pricing</h1>
          <div className="pricing-comparison">
            <div>
              <h3>Starter - $9/mo</h3>
              <p>Features included:</p>
            </div>
            <div className="popular">
              <h3>Pro - $29/mo</h3>
              <span>Most Popular</span>
            </div>
            <div>
              <h3>Enterprise - $99/mo</h3>
            </div>
          </div>
        </div>
      `,
      filename: 'pricing.tsx',
    },

    // Pricing with table element
    {
      code: `
        <div>
          <h1>Plans</h1>
          <p>$19/month</p>
          <table>
            <tr><th>Feature</th><th>Basic</th><th>Pro</th></tr>
          </table>
          <span>Recommended</span>
        </div>
      `,
      filename: 'plans.tsx',
    },

    // Pricing with feature list
    {
      code: `
        <div>
          <h2>Subscription Plans</h2>
          <p>Starting at $5/mo</p>
          <div className="feature-list">
            <ul>What's included</ul>
          </div>
          <span>Best Value</span>
        </div>
      `,
      filename: 'subscription.tsx',
    },

    // No pricing tiers - rule doesn't apply
    {
      code: `
        <div>
          <h1>Pricing Coming Soon</h1>
        </div>
      `,
      filename: 'pricing.tsx',
    },
  ],

  invalid: [
    // Pricing page without comparison
    {
      code: `
        <div>
          <h1>Pricing</h1>
          <div>
            <h3>Basic - $9/mo</h3>
          </div>
          <div>
            <h3>Pro - $29/mo</h3>
          </div>
        </div>
      `,
      filename: 'pricing.tsx',
      errors: [
        { messageId: 'missingComparison' },
        { messageId: 'missingPopularBadge' },
      ],
    },

    // Pricing with comparison but no popular badge
    {
      code: `
        <div>
          <h1>Plans</h1>
          <p>$19/month</p>
          <div className="comparison">
            <p>Features included</p>
          </div>
        </div>
      `,
      filename: 'plans.tsx',
      errors: [{ messageId: 'missingPopularBadge' }],
    },

    // Pricing with popular but no comparison
    {
      code: `
        <div>
          <h1>Subscription</h1>
          <p>€29/mo</p>
          <span>Most Popular</span>
        </div>
      `,
      filename: 'subscription.tsx',
      errors: [{ messageId: 'missingComparison' }],
    },
  ],
});

console.log('✅ require-pricing-comparison: All tests passed');
