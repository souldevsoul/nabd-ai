/**
 * Tests for require-responsive-images rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-responsive-images');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-responsive-images', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
