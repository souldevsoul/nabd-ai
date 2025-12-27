/**
 * Tests for require-currency-multi-support rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-currency-multi-support');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-currency-multi-support', rule, {
  valid: [
    // Non-pricing file
    {
      code: '<div>$99/month</div>',
      filename: 'about.tsx',
    },

    // Multiple currencies with selector
    {
      code: `
        <div>
          <CurrencySelector />
          <p>$99 USD</p>
          <p>€89 EUR</p>
        </div>
      `,
      filename: 'pricing.tsx',
    },

    // Multiple currencies with function selector
    {
      code: `
        function setCurrency(c) {}
        const price = "$99 or €89";
      `,
      filename: 'plans.tsx',
    },

    // Already has multiple required currencies
    {
      code: `
        <div>
          <select name="currency-select">
            <option>USD</option>
            <option>EUR</option>
          </select>
          <p>$99</p>
          <p>€89</p>
        </div>
      `,
      filename: 'pricing.tsx',
    },
  ],

  invalid: [
    // Single currency only (USD)
    {
      code: '<div><p>Pro Plan: $99/month</p><p>Enterprise: $299/month</p></div>',
      filename: 'pricing.tsx',
      errors: [{ messageId: 'singleCurrencyOnly' }],
    },

    // Single currency only (EUR)
    {
      code: '<div><p>Basic: €49/month</p></div>',
      filename: 'plans.tsx',
      errors: [{ messageId: 'singleCurrencyOnly' }],
    },

    // Multiple currencies but no selector
    {
      code: `
        <div>
          <p>$99 USD</p>
          <p>€89 EUR</p>
          <p>£79 GBP</p>
        </div>
      `,
      filename: 'pricing.tsx',
      errors: [{ messageId: 'missingCurrencySelector' }],
    },
  ],
});

console.log('✅ require-currency-multi-support: All tests passed');
