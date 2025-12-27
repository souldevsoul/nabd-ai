/**
 * Tests for require-schema-markup rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-schema-markup');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-schema-markup', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/app/dashboard/page.tsx' }, // Dashboard excluded
    { code: 'const x = 1;', filename: '/app/admin/page.tsx' }, // Admin excluded
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Component excluded
  ],
  invalid: [],
});
