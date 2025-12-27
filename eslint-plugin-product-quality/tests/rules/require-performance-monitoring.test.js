/**
 * Tests for require-performance-monitoring rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-performance-monitoring');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-performance-monitoring', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
