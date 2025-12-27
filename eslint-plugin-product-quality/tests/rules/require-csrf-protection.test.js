/**
 * Tests for require-csrf-protection rule
 * Security rule to ensure CSRF protection on API mutation endpoints
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-csrf-protection');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-csrf-protection', rule, {
  valid: [
    // Non-API file
    { code: 'export async function POST() {}', filename: '/app/page.tsx' },

    // GET request (no CSRF needed)
    {
      code: 'export async function GET(request) { return Response.json({}); }',
      filename: '/app/api/users/route.ts',
    },

    // POST with CSRF check via headers.get
    {
      code: `
        export async function POST(request) {
          const csrfToken = request.headers.get('x-csrf-token');
          if (!validateCsrfToken(csrfToken)) {
            return new Response('Invalid CSRF', { status: 403 });
          }
          return Response.json({ success: true });
        }
      `,
      filename: '/app/api/payment/route.ts',
    },

    // POST with validateCsrfToken function
    {
      code: `
        import { validateCsrfToken } from '@/lib/csrf';
        export async function POST(request) {
          validateCsrfToken(request);
          return Response.json({ success: true });
        }
      `,
      filename: '/app/api/checkout/route.ts',
    },

    // PUT with CSRF verification
    {
      code: `
        import { csrfProtection } from '@/middleware';
        export async function PUT(request) {
          await csrfProtection.verify(request);
          return Response.json({});
        }
      `,
      filename: '/app/api/users/route.ts',
    },

    // Non-mutation endpoint (component file)
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
  ],

  invalid: [
    // POST without CSRF check
    {
      code: `
        export async function POST(request) {
          const { amount } = await request.json();
          await processPayment(amount);
          return Response.json({ success: true });
        }
      `,
      filename: '/app/api/payment/route.ts',
      errors: [{ messageId: 'missingCsrfCheck', data: { method: 'POST' } }],
    },

    // PUT without CSRF check
    {
      code: `
        export async function PUT(request) {
          const data = await request.json();
          await updateUser(data);
          return Response.json({});
        }
      `,
      filename: '/app/api/users/route.ts',
      errors: [{ messageId: 'missingCsrfCheck', data: { method: 'PUT' } }],
    },

    // DELETE without CSRF check
    {
      code: `
        export async function DELETE(request) {
          const { id } = await request.json();
          await deleteRecord(id);
          return Response.json({});
        }
      `,
      filename: '/app/api/records/route.ts',
      errors: [{ messageId: 'missingCsrfCheck', data: { method: 'DELETE' } }],
    },

    // Const export without CSRF
    {
      code: `
        export const PATCH = async (request) => {
          return Response.json({});
        };
      `,
      filename: '/app/api/items/route.ts',
      errors: [{ messageId: 'missingCsrfCheck', data: { method: 'PATCH' } }],
    },
  ],
});

console.log('require-csrf-protection: All tests passed!');
