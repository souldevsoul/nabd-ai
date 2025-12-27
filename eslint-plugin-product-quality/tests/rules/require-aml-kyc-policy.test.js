/**
 * Tests for require-aml-kyc-policy rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-aml-kyc-policy');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-aml-kyc-policy', rule, {
  valid: [
    // Non-high-risk site
    {
      code: '<div>Simple SaaS product</div>',
      filename: 'page.tsx',
    },

    // High-risk site with both AML and KYC
    {
      code: `
        <div>
          <p>Buy and sell cryptocurrency</p>
          <a href="/aml-policy">AML Policy</a>
          <a href="/kyc-policy">KYC Policy</a>
        </div>
      `,
      filename: 'page.tsx',
    },

    // Crypto site with proper compliance
    {
      code: `
        <footer>
          <p>Bitcoin trading platform</p>
          <p>Anti-Money Laundering Policy</p>
          <p>Know Your Customer verification required</p>
        </footer>
      `,
      filename: 'footer.tsx',
    },

    // Gambling site with compliance
    {
      code: `
        <div>
          <h1>Online Casino</h1>
          <a href="/legal/aml">AML</a>
          <p>Identity verification required for withdrawals</p>
        </div>
      `,
      filename: 'page.tsx',
    },

    // Non-relevant file (should be ignored)
    {
      code: '<div>Crypto exchange</div>',
      filename: 'dashboard/settings.tsx',
    },
  ],

  invalid: [
    // Crypto site without any compliance
    {
      code: '<div>Trade Bitcoin and Ethereum easily</div>',
      filename: 'page.tsx',
      errors: [{ messageId: 'missingComplianceLink' }],
    },

    // Gambling site without compliance
    {
      code: '<div>Online betting and gambling platform</div>',
      filename: 'page.tsx',
      errors: [{ messageId: 'missingComplianceLink' }],
    },

    // Forex site without compliance
    {
      code: '<div>Forex trading with leverage</div>',
      filename: 'page.tsx',
      errors: [{ messageId: 'missingComplianceLink' }],
    },

    // Crypto site with only AML (missing KYC)
    {
      code: `
        <div>
          <p>Cryptocurrency exchange</p>
          <a href="/aml-policy">Anti-Money Laundering Policy</a>
        </div>
      `,
      filename: 'page.tsx',
      errors: [{ messageId: 'missingKycPolicy' }],
    },

    // Investment site with only KYC (missing AML)
    {
      code: `
        <div>
          <p>Investment platform for securities</p>
          <p>KYC verification required</p>
        </div>
      `,
      filename: 'page.tsx',
      errors: [{ messageId: 'missingAmlPolicy' }],
    },
  ],
});

console.log('✅ require-aml-kyc-policy: All tests passed');
