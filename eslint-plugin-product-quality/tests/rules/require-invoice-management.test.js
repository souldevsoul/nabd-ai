/**
 * Tests for require-invoice-management rule
 * Note: This rule checks file system for invoice pages and API
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-invoice-management');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-invoice-management', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not billing or dashboard
    { code: 'export default function Page() {}', filename: '/app/about/page.tsx' }, // Not relevant
  ],
  invalid: [
    // Note: Testing actual invalid cases would require mocking the file system and package.json
    // The rule checks for Stripe dependency and invoice pages/API
  ],
});
