/**
 * Tests for require-rate-limiting rule
 * Security rule to ensure API routes have rate limiting
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-rate-limiting');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-rate-limiting', rule, {
  valid: [
    // Non-API file
    { code: 'export async function POST() {}', filename: '/app/page.tsx' },

    // API route with rate limiting import
    {
      code: `
        import { Ratelimit } from '@upstash/ratelimit';
        export async function POST(request) {
          return Response.json({});
        }
      `,
      filename: '/app/api/login/route.ts',
    },

    // API route with ratelimit usage
    {
      code: `
        const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '10 s') });
        export async function POST(request) {
          const { success } = await ratelimit.limit(ip);
          return Response.json({});
        }
      `,
      filename: '/app/api/signup/route.ts',
    },

    // API route with limiter
    {
      code: `
        import { limiter } from '@/lib/rate-limit';
        export async function POST(request) {
          await limiter.check(request);
          return Response.json({});
        }
      `,
      filename: '/app/api/auth/route.ts',
    },

    // Non-auth API route (no rate limiting required for non-critical)
    {
      code: `
        export async function GET(request) {
          return Response.json({ data: [] });
        }
      `,
      filename: '/app/api/products/route.ts',
    },

    // API with throttle middleware
    {
      code: `
        import { throttle } from '@/middleware';
        export async function POST(request) {
          return Response.json({});
        }
      `,
      filename: '/app/api/reset-password/route.ts',
    },
  ],

  invalid: [
    // Login without rate limiting
    {
      code: `
        export async function POST(request) {
          const { email, password } = await request.json();
          const user = await authenticate(email, password);
          return Response.json({ user });
        }
      `,
      filename: '/app/api/login/route.ts',
      errors: [{ messageId: 'authEndpointNoRateLimit', data: { routeName: 'login' } }],
    },

    // Signup without rate limiting
    {
      code: `
        export async function POST(request) {
          const data = await request.json();
          await createUser(data);
          return Response.json({ success: true });
        }
      `,
      filename: '/app/api/signup/route.ts',
      errors: [{ messageId: 'authEndpointNoRateLimit', data: { routeName: 'signup' } }],
    },

    // Auth endpoint without rate limiting
    {
      code: `
        export async function POST(request) {
          return Response.json({});
        }
      `,
      filename: '/app/api/auth/route.ts',
      errors: [{ messageId: 'authEndpointNoRateLimit', data: { routeName: 'auth' } }],
    },

    // Reset password without rate limiting
    {
      code: `
        export async function POST(request) {
          const { email } = await request.json();
          await sendResetEmail(email);
          return Response.json({});
        }
      `,
      filename: '/app/api/reset-password/route.ts',
      errors: [{ messageId: 'authEndpointNoRateLimit', data: { routeName: 'reset-password' } }],
    },

    // Register without rate limiting
    {
      code: `
        export async function POST(request) {
          return Response.json({});
        }
      `,
      filename: '/app/api/register/route.ts',
      errors: [{ messageId: 'authEndpointNoRateLimit', data: { routeName: 'register' } }],
    },
  ],
});

console.log('require-rate-limiting: All tests passed!');
