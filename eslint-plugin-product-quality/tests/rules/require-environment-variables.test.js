/**
 * Tests for require-environment-variables rule
 * Note: This rule checks for environment variable usage and .env file definitions
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-environment-variables');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-environment-variables', rule, {
  valid: [
    { code: 'const x = 1;' }, // No env var usage
    { code: 'const value = "hardcoded";' }, // No env var usage
  ],
  invalid: [
    // Testing requires file system mocking for .env files
    // The rule checks process.env.VARIABLE usage against .env file definitions
  ],
});
