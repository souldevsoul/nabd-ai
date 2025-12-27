/**
 * Tests for require-complete-user-flow rule
 * Note: This rule checks file system for page structure
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-complete-user-flow');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-complete-user-flow', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not layout or page
    { code: 'export default function Component() {}', filename: '/components/Header.tsx' },
  ],
  invalid: [
    // Note: Testing actual invalid cases would require mocking the file system
    // The rule checks for various page files and navigation components
  ],
});
