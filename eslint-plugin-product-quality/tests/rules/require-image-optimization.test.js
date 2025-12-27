/**
 * Tests for require-image-optimization rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-image-optimization');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-image-optimization', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
