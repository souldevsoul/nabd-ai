/**
 * Tests for require-text-color-contrast rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-text-color-contrast');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-text-color-contrast', rule, {
  valid: [
    { code: '<div className="bg-black text-white">Light text on dark</div>' },
    { code: '<div className="bg-white text-slate-900">Dark text on light</div>' },
    { code: '<div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Gradient</div>' }, // Gradients are skipped
    { code: '<div className="bg-slate-50 text-gray-800">Content</div>' },
  ],
  invalid: [],
});
