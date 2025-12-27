/**
 * Tests for require-brand-import rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-brand-import');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-brand-import', rule, {
  valid: [
    { code: 'const x = 1;' }, // No BRAND usage
    { code: 'const BRAND_OTHER = { name: "test" };' }, // Different identifier
  ],
  invalid: [],
});
