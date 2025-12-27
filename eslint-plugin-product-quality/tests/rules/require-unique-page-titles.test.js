/**
 * Tests for require-unique-page-titles rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-unique-page-titles');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-unique-page-titles', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
