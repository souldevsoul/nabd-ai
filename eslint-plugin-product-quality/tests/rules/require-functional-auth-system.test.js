/**
 * Tests for require-functional-auth-system rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-functional-auth-system');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-functional-auth-system', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
