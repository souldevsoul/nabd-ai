/**
 * Tests for require-consistent-legal-page-design rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-consistent-legal-page-design');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-consistent-legal-page-design', rule, {
  valid: [
    { code: '<div>Content</div>', filename: '/app/about/page.tsx' }, // Not a legal page
    { code: '<h1>Privacy Policy</h1>', filename: '/app/privacy/page.tsx' }, // Legal page
    { code: '<section>Terms</section>', filename: '/app/terms/page.tsx' }, // Legal page
  ],
  invalid: [
    // This rule currently does structural validation placeholder
    // Can be extended with specific design pattern checks
  ],
});
