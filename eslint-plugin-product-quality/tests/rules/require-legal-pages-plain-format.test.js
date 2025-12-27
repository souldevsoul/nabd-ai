/**
 * Tests for require-legal-pages-plain-format rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-legal-pages-plain-format');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-legal-pages-plain-format', rule, {
  valid: [
    { code: '<div className="rounded-xl">Card</div>', filename: '/app/about/page.tsx' }, // Not a legal page
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not a legal page
  ],
  invalid: [],
});
