/**
 * @fileoverview Require error boundaries in Next.js app
 * @author AutoQA
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure error boundaries are implemented for production resilience',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingGlobalErrorPage: 'Missing global error.tsx in app directory - required for error handling',
      missingErrorComponent: 'Missing error.tsx in {{dir}} - consider adding route-specific error handling',
      missingErrorBoundary: 'Component "{{name}}" should be wrapped in an error boundary',
    },
    schema: [{
      type: 'object',
      properties: {
        requireGlobalError: {
          type: 'boolean',
          default: true,
        },
        requireRouteErrors: {
          type: 'boolean',
          default: false,
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    const options = context.options[0] || {};
    const requireGlobalError = options.requireGlobalError !== false;
    const requireRouteErrors = options.requireRouteErrors === true;

    const filename = context.getFilename();
    const cwd = context.getCwd();

    // Only check layout.tsx files in app directory
    if (!filename.includes('/app/') || !filename.endsWith('/layout.tsx')) {
      return {};
    }

    return {
      Program(node) {
        // Check for global error.tsx
        if (requireGlobalError && filename.includes('/app/layout.tsx')) {
          const appDir = path.dirname(filename);
          const globalErrorPath = path.join(appDir, 'error.tsx');

          if (!fs.existsSync(globalErrorPath)) {
            context.report({
              node,
              messageId: 'missingGlobalErrorPage',
            });
          }
        }

        // Check for route-specific error.tsx
        if (requireRouteErrors && !filename.endsWith('/app/layout.tsx')) {
          const routeDir = path.dirname(filename);
          const errorPath = path.join(routeDir, 'error.tsx');

          if (!fs.existsSync(errorPath)) {
            const relativeDir = path.relative(cwd, routeDir);
            context.report({
              node,
              messageId: 'missingErrorComponent',
              data: { dir: relativeDir },
            });
          }
        }
      },
    };
  },
};
