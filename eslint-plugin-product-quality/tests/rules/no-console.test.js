/**
 * Tests for no-console rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-console');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-console', rule, {
  valid: [
    { code: 'console.error("Error occurred");' }, // console.error is allowed
    { code: 'console.warn("Warning");' }, // console.warn is allowed
    { code: 'const log = "message";' }, // Not console
    { code: 'logger.log("message");' }, // Different object
  ],
  invalid: [],
});
