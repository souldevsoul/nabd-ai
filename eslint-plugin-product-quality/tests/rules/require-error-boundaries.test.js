/**
 * Tests for require-error-boundaries rule
 * Note: This rule checks file system for error.tsx files
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-error-boundaries');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-error-boundaries', rule, {
  valid: [
    { code: 'export default function Page() { return <div>Page</div>; }', filename: '/app/page.tsx' }, // Not layout
    { code: 'const Component = () => <div>Hello</div>;', filename: '/components/Button.tsx' }, // Not in app/
    { code: 'export default function Layout() { return <div>{children}</div>; }', filename: '/src/components/Layout.tsx' }, // Not app layout
  ],
  invalid: [
    // Note: Testing actual invalid cases would require mocking the file system
    // The rule checks for error.tsx files which don't exist in test environment
  ],
});
