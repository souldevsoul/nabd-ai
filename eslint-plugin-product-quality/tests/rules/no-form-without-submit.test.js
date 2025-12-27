/**
 * Tests for no-form-without-submit rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-form-without-submit');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-form-without-submit', rule, {
  valid: [
    { code: '<form onSubmit={handleSubmit}><button type="submit">Submit</button></form>' },
    { code: '<form action="/api/submit"><button type="submit">Go</button></form>' },
  ],
  invalid: [
    { code: '<form><input type="text" /></form>', errors: [{ messageId: 'missingSubmit' }] },
  ],
});
