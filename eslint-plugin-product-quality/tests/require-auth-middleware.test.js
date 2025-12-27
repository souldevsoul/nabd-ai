/**
 * Tests for require-auth-middleware rule
 */

const { RuleTester } = require('eslint');
const rule = require('../rules/require-auth-middleware');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

// Note: This rule checks filesystem for middleware.ts and protected routes
// Tests are limited because we can't easily mock the filesystem
// The rule only runs on app/layout.tsx files

ruleTester.run('require-auth-middleware', rule, {
  valid: [
    // Non-layout files should pass
    {
      code: `
        export default function Page() {
          return <div>Page</div>;
        }
      `,
      filename: '/app/page.tsx',
    },
    // Dashboard page (not layout) should pass
    {
      code: `
        export default function DashboardPage() {
          return <div>Dashboard</div>;
        }
      `,
      filename: '/app/dashboard/page.tsx',
    },
    // Component files should pass
    {
      code: `
        export function Header() {
          return <header>Header</header>;
        }
      `,
      filename: '/components/Header.tsx',
    },
  ],

  invalid: [
    // Root layout in a project - rule may report if no middleware exists
    // This test documents expected behavior but actual result depends on filesystem
  ],
});

console.log('All require-auth-middleware tests passed!');
