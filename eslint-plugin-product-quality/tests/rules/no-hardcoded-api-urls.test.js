/**
 * Tests for no-hardcoded-api-urls rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-hardcoded-api-urls');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-hardcoded-api-urls', rule, {
  valid: [
    { code: 'fetch(process.env.API_URL)' },
    { code: 'const url = `${process.env.BASE_URL}/api`;' },
    { code: 'fetch("/api/data")' }, // Relative URLs are OK
  ],
  invalid: [],
});
