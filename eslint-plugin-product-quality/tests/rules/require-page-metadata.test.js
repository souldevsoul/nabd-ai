/**
 * Tests for require-page-metadata rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-page-metadata');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-page-metadata', rule, {
  valid: [
    {
      code: 'export const metadata = { title: "About Us - Learn more about our amazing company", description: "Discover our story, mission, and values. We are dedicated to providing the best service to our customers with innovation and excellence." }; export default function Page() {}',
      filename: '/app/about/page.tsx'
    },
    { code: '"use client"; export default function Page() {}', filename: '/app/about/page.tsx' }, // Client component
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not a page
  ],
  invalid: [
    {
      code: 'export default function Page() { return <div>About</div>; }',
      filename: '/app/about/page.tsx',
      errors: [{ messageId: 'missingMetadata' }],
    },
  ],
});
