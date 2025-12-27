/**
 * Tests for require-accessible-forms rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-accessible-forms');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-accessible-forms', rule, {
  valid: [
    { code: '<form onSubmit={handleSubmit}><input type="text" id="name" /><label htmlFor="name">Name</label></form>' },
    { code: '<form action="/submit"><input type="email" aria-label="Email" /></form>' },
    { code: '<input type="text" id="field" aria-labelledby="label" />' },
    { code: '<div>No form here</div>' },
  ],
  invalid: [],
});
