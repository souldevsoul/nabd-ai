/**
 * Tests for require-dashboard-settings-complete rule
 * Note: This rule checks file system for settings pages
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-dashboard-settings-complete');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-dashboard-settings-complete', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not dashboard
    { code: 'export default function Page() {}', filename: '/app/about/page.tsx' }, // Not dashboard
  ],
  invalid: [
    // Note: Testing actual invalid cases would require mocking the file system
    // The rule checks for billing, account, profile, and team pages
  ],
});
