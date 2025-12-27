/**
 * Tests for enforce-color-contrast rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/enforce-color-contrast');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('enforce-color-contrast', rule, {
  valid: [
    { code: '<div className="text-black bg-white">Good contrast</div>' },
    { code: '<div className="text-white bg-black">Good contrast</div>' },
    { code: '<div className="text-slate-900 bg-white">Good contrast</div>' },
    { code: '<div className="text-lg">Font size class</div>' }, // Not color
  ],
  invalid: [
    {
      code: '<div className="text-gray-400 bg-white">Low contrast</div>',
      errors: [{ messageId: 'potentialContrastIssue' }],
    },
    {
      code: '<div className="text-yellow-400 bg-white">Low contrast</div>',
      errors: [{ messageId: 'potentialContrastIssue' }],
    },
  ],
});
