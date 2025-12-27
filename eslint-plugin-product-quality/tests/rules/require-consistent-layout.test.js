/**
 * Tests for require-consistent-layout rule
 * Note: This rule checks for Header/Footer imports and rendering
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-consistent-layout');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-consistent-layout', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' }, // Not a page
    { code: 'import Header from "@/components/Header"; import Footer from "@/components/Footer"; export default function Page() { return <div><Header /><main>Content</main><Footer /></div>; }', filename: '/app/about/page.tsx' },
  ],
  invalid: [
    // Testing requires specific page files without proper Header/Footer imports
  ],
});
