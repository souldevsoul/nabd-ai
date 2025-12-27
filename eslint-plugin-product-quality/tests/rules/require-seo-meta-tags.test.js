/**
 * Tests for require-seo-meta-tags rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-seo-meta-tags');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-seo-meta-tags', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not in app/
    { code: 'export const x = 1;', filename: '/app/api/route.ts' }, // Not page.tsx
    {
      code: `export const metadata = {
        title: "This is a great page title for SEO purposes",
        description: "This is a comprehensive description that helps search engines understand what this page is about and improves SEO ranking",
        openGraph: {}
      };`,
      filename: '/app/page.tsx'
    },
  ],
  invalid: [
    {
      code: 'export default function Page() { return <div>Page</div>; }',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'missingMetadataExport' }],
    },
  ],
});
