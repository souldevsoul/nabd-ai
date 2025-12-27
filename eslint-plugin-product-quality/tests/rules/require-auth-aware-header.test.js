/**
 * Tests for require-auth-aware-header rule
 * Note: This rule checks for authentication hooks in Header components
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-auth-aware-header');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-auth-aware-header', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not Header
    { code: 'const x = 1;', filename: '/app/page.tsx' }, // Not Header
  ],
  invalid: [
    // Testing requires Header component file with missing auth checks
    // The rule checks for useSession, getServerSession imports and conditional rendering
  ],
});
