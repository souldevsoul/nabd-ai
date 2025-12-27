/**
 * Tests for require-session-provider rule
 */

const { RuleTester } = require('eslint');
const rule = require('../rules/require-session-provider');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('require-session-provider', rule, {
  valid: [
    // Root layout with SessionProvider
    {
      code: `
        import { SessionProvider } from "next-auth/react";

        export default function RootLayout({ children }) {
          return (
            <html>
              <body>
                <SessionProvider>{children}</SessionProvider>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },
    // Root layout with Providers component
    {
      code: `
        import { Providers } from "./providers";

        export default function RootLayout({ children }) {
          return (
            <html>
              <body>
                <Providers>{children}</Providers>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },
    // Root layout with AuthProvider
    {
      code: `
        import { AuthProvider } from "@/components/auth-provider";

        export default function RootLayout({ children }) {
          return (
            <html>
              <body>
                <AuthProvider>{children}</AuthProvider>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },
    // Non-root layout (should be skipped)
    {
      code: `
        export default function DashboardLayout({ children }) {
          return <div>{children}</div>;
        }
      `,
      filename: '/app/dashboard/layout.tsx',
    },
    // Route group layout (should be skipped)
    {
      code: `
        export default function AuthLayout({ children }) {
          return <div>{children}</div>;
        }
      `,
      filename: '/app/(auth)/layout.tsx',
    },
    // Root layout without auth usage (no error - project may not need auth)
    {
      code: `
        export default function RootLayout({ children }) {
          return (
            <html>
              <body>{children}</body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },
  ],

  invalid: [
    // Root layout with useSession but no SessionProvider
    {
      code: `
        import { useSession } from "next-auth/react";

        export default function RootLayout({ children }) {
          return (
            <html>
              <body>{children}</body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
      errors: [{ messageId: 'missingSessionProvider' }],
    },
  ],
});

console.log('All require-session-provider tests passed!');
