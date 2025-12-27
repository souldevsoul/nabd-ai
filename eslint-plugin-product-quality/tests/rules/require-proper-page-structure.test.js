/**
 * Tests for require-proper-page-structure rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-proper-page-structure');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-proper-page-structure', rule, {
  valid: [
    { code: '<div><Header /><main>Content</main><Footer /></div>', filename: '/app/about/page.tsx' },
    { code: '<div><Navbar /><main>Content</main><Footer /></div>', filename: '/app/about/page.tsx' },
    { code: '<div>Component</div>', filename: '/components/Button.tsx' }, // Not a page
  ],
  invalid: [
    {
      code: '<div><Header /><div>Content</div></div>',
      filename: '/app/about/page.tsx',
      errors: [{ messageId: 'missingMain' }, { messageId: 'missingFooter' }],
    },
  ],
});
