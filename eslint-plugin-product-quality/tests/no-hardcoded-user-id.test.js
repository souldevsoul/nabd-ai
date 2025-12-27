/**
 * Tests for no-hardcoded-user-id rule
 */

const { RuleTester } = require('eslint');
const rule = require('../rules/no-hardcoded-user-id');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-hardcoded-user-id', rule, {
  valid: [
    // API route with proper auth import and session usage
    {
      code: `
        import { auth } from "@/lib/auth";

        export async function GET() {
          const session = await auth();
          const userId = session?.user?.id;
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/users/me/route.ts',
    },
    // API route with next-auth import
    {
      code: `
        import { getServerSession } from "next-auth";

        export async function GET() {
          const session = await getServerSession();
          const userId = session?.user?.id;
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/users/route.ts',
    },
    // Non-API route file (should be skipped)
    {
      code: `
        const userId = "temp-user-id";
        export default function Page() {
          return userId;
        }
      `,
      filename: '/app/dashboard/page.tsx',
    },
    // Auth-related API route (should be skipped)
    {
      code: `
        const userId = "temp-user-id";
        export async function POST() {
          return Response.json({ ok: true });
        }
      `,
      filename: '/app/api/auth/callback/route.ts',
    },
    // Variable not named userId
    {
      code: `
        const id = "temp-user-id";
        export async function GET() {
          return Response.json({ id });
        }
      `,
      filename: '/app/api/test/route.ts',
    },
  ],

  invalid: [
    // Hardcoded temp-user-id
    {
      code: `
        export async function GET() {
          const userId = "temp-user-id";
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/users/me/route.ts',
      errors: [{ messageId: 'hardcodedUserId' }],
    },
    // Hardcoded test-user
    {
      code: `
        export async function GET() {
          const userId = "test-user";
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/photos/route.ts',
      errors: [{ messageId: 'hardcodedUserId' }],
    },
    // Hardcoded demo-user
    {
      code: `
        export async function GET() {
          const userId = "demo-user";
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/clips/route.ts',
      errors: [{ messageId: 'hardcodedUserId' }],
    },
    // Hardcoded placeholder
    {
      code: `
        export async function POST() {
          const userId = "placeholder";
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/data/route.ts',
      errors: [{ messageId: 'hardcodedUserId' }],
    },
    // Hardcoded user-123 pattern
    {
      code: `
        export async function GET() {
          const userId = "user-123";
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/items/route.ts',
      errors: [{ messageId: 'hardcodedUserId' }],
    },
    // Suspicious userId without auth import
    {
      code: `
        export async function GET() {
          const userId = "abc123def";
          return Response.json({ userId });
        }
      `,
      filename: '/app/api/data/route.ts',
      errors: [{ messageId: 'suspiciousUserId' }],
    },
  ],
});

console.log('All no-hardcoded-user-id tests passed!');
