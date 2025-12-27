/**
 * Tests for require-proper-heading-hierarchy rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-proper-heading-hierarchy');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-proper-heading-hierarchy', rule, {
  valid: [
    { code: '<div><h1>Title</h1><h2>Subtitle</h2></div>', filename: '/app/about/page.tsx' },
    { code: '<div><h1>Title</h1><h2>Sub1</h2><h3>Sub2</h3></div>', filename: '/app/about/page.tsx' },
    { code: '<div>Content</div>', filename: '/components/Header.tsx' }, // Not a page file
    { code: 'describe("test", () => {});', filename: '/app/about/page.test.tsx' }, // Test file excluded
  ],
  invalid: [
    {
      code: '<div><h1>Title 1</h1><h1>Title 2</h1></div>',
      filename: '/app/about/page.tsx',
      errors: [{ messageId: 'multipleH1' }],
    },
    {
      code: '<div><h1>Title</h1><h4>Skipped</h4></div>',
      filename: '/app/about/page.tsx',
      errors: [{ messageId: 'skippedHeadingLevel' }],
    },
  ],
});
