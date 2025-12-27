/**
 * Tests for require-appropriate-text-color-for-background rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-appropriate-text-color-for-background');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-appropriate-text-color-for-background', rule, {
  valid: [
    { code: '<div className="text-white bg-gray-900">Dark bg with light text</div>' },
    { code: '<div className="text-gray-900 bg-white">Light bg with dark text</div>' },
    { code: '<div className="text-slate-800 bg-gray-50">Light bg with dark text</div>' },
  ],
  invalid: [
    // Rule detects inappropriate combinations based on luminance
  ],
});
