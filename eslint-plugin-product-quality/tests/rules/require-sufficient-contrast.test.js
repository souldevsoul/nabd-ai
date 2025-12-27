/**
 * Tests for require-sufficient-contrast rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-sufficient-contrast');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-sufficient-contrast', rule, {
  valid: [
    { code: '<div className="text-gray-900 bg-white">Good contrast</div>' },
    { code: '<div className="text-white bg-gray-900">Good contrast</div>' },
    { code: '<div className="text-black bg-gray-100">Good contrast</div>' },
  ],
  invalid: [
    {
      code: '<div className="text-gray-400 bg-gray-600">Low contrast</div>',
      errors: [{ messageId: 'lowContrast' }],
    },
    {
      code: '<div className="text-[#A5B4C1] bg-[#1F2937]">Custom low contrast</div>',
      errors: [{ messageId: 'lowContrast' }],
    },
  ],
});
