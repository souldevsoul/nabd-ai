/**
 * Tests for require-loading-state-on-async-button rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-loading-state-on-async-button');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-loading-state-on-async-button', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
