/**
 * Tests for no-brutalist-design rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-brutalist-design');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-brutalist-design', rule, {
  valid: [
    { code: '<div className="rounded-lg shadow-md">Card</div>' },
    { code: '<button className="bg-blue-500 hover:bg-blue-600">Click</button>' },
    { code: '<div className="border border-slate-200">Normal border</div>' },
  ],
  invalid: [
    { code: '<div className="border-8 border-black">Box</div>', errors: [{ messageId: 'noBrutalistBorder' }] },
    { code: '<div className="border-4 border-black">Box</div>', errors: [{ messageId: 'noBrutalistBorder' }] },
  ],
});
