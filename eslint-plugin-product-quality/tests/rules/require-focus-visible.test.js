/**
 * Tests for require-focus-visible rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-focus-visible');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-focus-visible', rule, {
  valid: [
    { code: '<button className="bg-blue-500 focus:ring-2">Click</button>', filename: '/app/page.tsx' },
    { code: '<a className="bg-blue-500 focus-visible:outline-2">Link</a>', filename: '/app/page.tsx' },
    { code: '<button disabled>Disabled</button>', filename: '/app/page.tsx' }, // Disabled buttons excluded
    { code: '<button>Plain button</button>', filename: '/app/page.tsx' }, // No custom styling - browser default OK
    { code: 'describe("test", () => {});', filename: '/app/page.test.tsx' }, // Test file excluded
  ],
  invalid: [
    {
      code: '<button className="bg-blue-500 outline-none">No focus</button>',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'focusOutlineRemoved' }],
    },
    {
      code: '<button className="bg-blue-500 border-gray-300">Styled no focus</button>',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'missingFocusState' }],
    },
  ],
});
