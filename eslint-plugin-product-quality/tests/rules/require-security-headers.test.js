/**
 * Tests for require-security-headers rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-security-headers');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-security-headers', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
