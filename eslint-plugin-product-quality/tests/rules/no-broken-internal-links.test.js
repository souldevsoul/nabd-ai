/**
 * Tests for no-broken-internal-links rule
 * Note: This rule checks file system - tests are limited to basic structure validation
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-broken-internal-links');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-broken-internal-links', rule, {
  valid: [
    { code: '<a href="https://external.com">Link</a>' }, // External link - not checked
    { code: '<a href="//cdn.example.com/file">CDN</a>' }, // Protocol-relative - not checked
    { code: '<a href="/api/users">API</a>' }, // API routes are excluded
    { code: '<a href="/">Home</a>' }, // Root path is always valid
    { code: 'const link = "/api/data";' }, // API route in object
  ],
  invalid: [
    // Note: These would fail in real scenarios without matching files
    // The rule requires actual file system access to validate paths
  ],
});
