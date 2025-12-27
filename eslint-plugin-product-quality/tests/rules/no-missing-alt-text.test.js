/**
 * Tests for no-missing-alt-text rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-missing-alt-text');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-missing-alt-text', rule, {
  valid: [
    { code: '<img src="/logo.png" alt="Company logo" />' },
    { code: '<Image src="/hero.jpg" alt="Hero image" />' },
    { code: '<img src="/icon.svg" alt="" role="presentation" />' },
  ],
  invalid: [
    {
      code: '<img src="/logo.png" />',
      output: '<img src="/logo.png" alt="" />',
      errors: [{ messageId: 'missingAlt' }]
    },
    {
      code: '<Image src="/hero.jpg" />',
      output: '<Image src="/hero.jpg" alt="" />',
      errors: [{ messageId: 'missingAlt' }]
    },
  ],
});
