/**
 * Tests for require-seo-metadata rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-seo-metadata');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-seo-metadata', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/app/api/users/route.ts' }, // API route excluded
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not a page
    {
      code: `export const metadata = {
        title: "About Us - Our Story",
        description: "Learn about our company history, mission, and the team behind our innovative products. We serve customers worldwide with dedication and excellence.",
        openGraph: { title: "About Us", images: ["/og.png"] },
        twitter: { card: "summary_large_image" }
      };`,
      filename: '/app/about/page.tsx'
    },
  ],
  invalid: [
    {
      code: 'export default function Page() { return <div>Page</div>; }',
      filename: '/app/about/page.tsx',
      errors: [{ messageId: 'missingMetadata' }],
    },
  ],
});
