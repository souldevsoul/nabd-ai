/**
 * Tests for use-styleguide-colors-only rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/use-styleguide-colors-only');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('use-styleguide-colors-only', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],
  invalid: [],
});
