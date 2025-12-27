/**
 * Tests for no-fake-content rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-fake-content');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-fake-content', rule, {
  valid: [
    { code: '<p>Welcome to our platform</p>' },
    { code: 'const text = "Real content here";' },
    { code: '<div>Contact us at support@example.com</div>' },
  ],
  invalid: [],
});
