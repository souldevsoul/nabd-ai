/**
 * Tests for require-complete-api-routes rule
 * Note: This rule checks file system for API route structure
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-complete-api-routes');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-complete-api-routes', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not API route
  ],
  invalid: [],
});
