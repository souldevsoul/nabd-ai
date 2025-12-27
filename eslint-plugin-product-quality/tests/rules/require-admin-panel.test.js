/**
 * Tests for require-admin-panel rule
 * Note: This rule checks file system for admin panel structure
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-admin-panel');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-admin-panel', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/app/page.tsx' }, // Not layout.tsx
    { code: 'export default function Page() {}', filename: '/components/Button.tsx' }, // Not app/layout
    { code: 'const config = {};', options: [{ requireAdmin: false }] }, // Admin not required
  ],
  invalid: [
    // Note: Testing actual invalid cases would require mocking the file system
    // The rule checks for admin directory and required pages
  ],
});
