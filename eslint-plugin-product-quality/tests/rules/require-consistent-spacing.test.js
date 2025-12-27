/**
 * Tests for require-consistent-spacing rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-consistent-spacing');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-consistent-spacing', rule, {
  valid: [
    { code: '<div className="py-16 px-4">Content</div>', filename: '/app/page.tsx' },
    { code: '<div className="gap-4">Items</div>', filename: '/app/page.tsx' },
    { code: '<div className="m-4">Content</div>', filename: '/app/page.tsx' },
    { code: 'const x = 1;', filename: '/app/page.ts' }, // Not tsx/jsx
    { code: 'describe("test", () => {});', filename: '/app/page.test.tsx' }, // Test file excluded
  ],
  invalid: [
    {
      code: '<div className="gap-4 space-y-4">Mixed spacing</div>',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'inconsistentGap' }],
    },
    {
      code: '<div className="m-[13px]">Custom margin</div>',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'inconsistentSpacing' }],
    },
  ],
});
