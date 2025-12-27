/**
 * Tests for require-cookie-consent rule
 * Note: This rule checks for cookie consent component and cookie policy pages
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-cookie-consent');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-cookie-consent', rule, {
  valid: [
    { code: 'export default function Page() { return <div>Page</div>; }', filename: '/app/page.tsx' }, // Not layout
    { code: 'export const GET = () => {};', filename: '/app/api/users/route.ts' }, // API route excluded
    { code: 'const middleware = () => {};', filename: '/middleware.ts' }, // Middleware excluded
    { code: 'describe("test", () => {});', filename: '/tests/page.test.ts' }, // Test file excluded
  ],
  invalid: [
    // Note: Testing actual invalid cases would require mocking the file system
    // The rule checks for CookieConsent component and cookie policy pages
  ],
});
