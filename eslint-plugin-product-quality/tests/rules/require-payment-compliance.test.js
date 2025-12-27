/**
 * Tests for require-payment-compliance rule
 * Note: This rule checks for payment processor compliance
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-payment-compliance');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-payment-compliance', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not relevant file
    { code: '<div>Pro Plan</div>', filename: '/app/pricing/page.tsx' }, // Valid B2C tier name
    { code: '<div>Starter</div>', filename: '/app/pricing/page.tsx' }, // Valid B2C tier name
  ],
  invalid: [
    {
      code: '<div>Enterprise Plan</div>',
      filename: '/app/pricing/page.tsx',
      errors: [{ messageId: 'b2bLanguageDetected' }],
    },
    {
      code: '<div>for businesses</div>',
      filename: '/app/pricing/page.tsx',
      errors: [{ messageId: 'b2bLanguageDetected' }],
    },
  ],
});
