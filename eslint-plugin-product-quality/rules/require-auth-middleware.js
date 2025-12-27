/**
 * ESLint Rule: require-auth-middleware
 *
 * Ensures that Next.js projects with authenticated areas have proper middleware
 * to protect routes. This prevents the common bug where dashboard/admin pages
 * can be accessed without authentication.
 *
 * DETECTS:
 * - Projects with /dashboard or /admin routes but no middleware.ts
 * - Middleware that doesn't protect authenticated routes
 *
 * @version 1.23.0
 * @date 2025-11-26
 * @category Security
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure Next.js projects with authenticated areas have auth middleware',
      category: 'Security',
      recommended: true,
    },
    messages: {
      missingMiddleware:
        'Project has authenticated routes ({{routes}}) but no middleware.ts file. Create middleware to protect these routes from unauthorized access.',
      middlewareMissingProtection:
        'middleware.ts exists but does not appear to protect {{route}} routes. Ensure middleware checks authentication for protected paths.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          protectedPaths: {
            type: 'array',
            items: { type: 'string' },
            description: 'Path patterns that require authentication',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const protectedPaths = options.protectedPaths || [
      'dashboard',
      'admin',
      'account',
      'settings',
      'portal',
      'studio',
      'specialist',
    ];

    const filename = context.getFilename();

    // Only run this check on the root layout.tsx (once per project)
    if (!filename.endsWith('app/layout.tsx') && !filename.endsWith('app\\layout.tsx')) {
      return {};
    }

    // Track whether we've already reported
    let hasReported = false;

    return {
      Program() {
        if (hasReported) return;

        const projectRoot = process.cwd();

        // Check which protected routes exist
        const existingProtectedRoutes = [];
        for (const route of protectedPaths) {
          const routePath = path.join(projectRoot, 'app', route);
          if (fs.existsSync(routePath)) {
            existingProtectedRoutes.push(route);
          }
        }

        // If no protected routes, no need for middleware
        if (existingProtectedRoutes.length === 0) {
          return;
        }

        // Check if middleware.ts exists
        const middlewarePath = path.join(projectRoot, 'middleware.ts');
        const middlewareJsPath = path.join(projectRoot, 'middleware.js');

        if (!fs.existsSync(middlewarePath) && !fs.existsSync(middlewareJsPath)) {
          hasReported = true;
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingMiddleware',
            data: { routes: existingProtectedRoutes.join(', ') },
          });
          return;
        }

        // Read middleware and check if it protects the routes
        const actualMiddlewarePath = fs.existsSync(middlewarePath)
          ? middlewarePath
          : middlewareJsPath;

        try {
          const middlewareContent = fs.readFileSync(actualMiddlewarePath, 'utf8');
          const middlewareContentLower = middlewareContent.toLowerCase();

          // Check if middleware has authentication logic
          const hasAuthCheck =
            middlewareContentLower.includes('auth') ||
            middlewareContentLower.includes('session') ||
            middlewareContentLower.includes('token') ||
            middlewareContentLower.includes('credential') ||
            middlewareContentLower.includes('next-auth') ||
            middlewareContentLower.includes('clerk') ||
            middlewareContentLower.includes('supabase') ||
            middlewareContentLower.includes('gettoken');

          if (!hasAuthCheck) {
            hasReported = true;
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'middlewareMissingProtection',
              data: { route: existingProtectedRoutes.join(', ') },
            });
            return;
          }

          // Check if protected routes are mentioned in middleware
          for (const route of existingProtectedRoutes) {
            if (!middlewareContent.includes(route)) {
              // Route not explicitly protected - could be using different pattern
              // Only warn if middleware doesn't seem to have general protection
              const hasGeneralProtection =
                middlewareContent.includes('protectedRoutes') ||
                middlewareContent.includes('protected') ||
                middlewareContent.includes('matcher');

              if (!hasGeneralProtection) {
                hasReported = true;
                context.report({
                  loc: { line: 1, column: 0 },
                  messageId: 'middlewareMissingProtection',
                  data: { route },
                });
                return;
              }
            }
          }
        } catch {
          // Ignore read errors
        }
      },
    };
  },
};
