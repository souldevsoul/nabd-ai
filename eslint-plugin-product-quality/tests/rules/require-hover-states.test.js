/**
 * Tests for require-hover-states rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-hover-states');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-hover-states', rule, {
  valid: [
    { code: '<button className="bg-blue-500 hover:bg-blue-600">Click</button>', filename: '/app/page.tsx' },
    { code: '<a href="/">Home</a>', filename: '/app/page.tsx' }, // Unstyled link - browser default
    { code: '<button disabled>Disabled</button>', filename: '/app/page.tsx' }, // Disabled excluded
    { code: 'describe("test", () => {});', filename: '/app/page.test.tsx' }, // Test file excluded
    { code: '<div>Content</div>', filename: '/app/page.tsx' }, // Non-interactive element
  ],
  invalid: [
    {
      code: '<button className="bg-blue-500">No hover</button>',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'missingHoverState' }],
    },
  ],
});
