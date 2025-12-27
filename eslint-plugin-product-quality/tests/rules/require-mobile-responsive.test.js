/**
 * Tests for require-mobile-responsive rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-mobile-responsive');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-mobile-responsive', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
