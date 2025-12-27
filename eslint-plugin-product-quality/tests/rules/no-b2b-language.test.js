/**
 * Tests for no-b2b-language rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-b2b-language');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('no-b2b-language', rule, {
  valid: [
    // Valid tier names
    { code: 'const tier = "Free";' },
    { code: 'const tier = "Starter";' },
    { code: 'const tier = "Pro";' },
    { code: 'const tier = "Premium";' },
    { code: 'const tier = "Advanced";' },
    // Valid JSX
    { code: '<Plan name="Pro" />' },
    { code: '<div>Choose your plan</div>' },
    // Valid pricing
    { code: 'const plans = { free: 0, pro: 29, premium: 99 };' },
  ],

  invalid: [
    // B2B tier names (only Business and Corporate are prohibited now)
    {
      code: 'const tier = "Business";',
      errors: [{ messageId: 'b2bTierName' }],
    },
    {
      code: 'const tier = "Corporate";',
      errors: [{ messageId: 'b2bTierName' }],
    },
    // B2B language/phrases
    {
      code: 'const desc = "For businesses";',
      errors: [{ messageId: 'b2bLanguage' }],
    },
    {
      code: '<div>Enterprise plan for companies</div>',
      errors: [{ messageId: 'b2bLanguage' }],
    },
    {
      code: 'const text = "B2B solutions";',
      errors: [{ messageId: 'b2bLanguage' }],
    },
  ],
});

console.log('no-b2b-language: All tests passed!');
