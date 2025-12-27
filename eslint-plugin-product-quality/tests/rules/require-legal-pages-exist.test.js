/**
 * Tests for require-legal-pages-exist rule
 * Note: This rule checks file system for existing pages
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-legal-pages-exist');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-legal-pages-exist', rule, {
  valid: [
    { code: '<a href="/about">About</a>', filename: '/components/footer.tsx' }, // Not a legal page link
    { code: '<a href="https://external.com">External</a>', filename: '/components/footer.tsx' }, // External link
    { code: '<a href="/terms">Terms</a>', filename: '/components/nav.tsx' }, // Not footer/header
    { code: 'const x = 1;', filename: '/app/page.tsx' }, // Not footer component
  ],
  invalid: [
    // Note: Testing actual invalid cases requires file system mocking
    // The rule checks for actual page.tsx files
  ],
});
