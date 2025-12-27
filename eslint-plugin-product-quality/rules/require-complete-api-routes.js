/**
 * @fileoverview Ensures all critical API routes are implemented for complete product
 * @author AutoQA
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures all critical API routes are implemented for end-to-end functionality',
      category: 'Completeness',
      recommended: true,
    },
    messages: {
      missingCoreApi: 'Critical API route "{{route}}" is missing. Required for {{reason}}.',
      missingWebhook: 'Webhook handler "{{webhook}}" is missing. Payment/service integration incomplete without it.',
      missingCrudOperation: 'CRUD operation missing for {{resource}}: {{operation}}. Incomplete resource management.',
      inconsistentApiPattern: 'API route "{{route}}" doesn\'t follow consistent error handling pattern. All routes must use try-catch and return { success, data/error }.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          coreRoutes: {
            type: 'array',
            description: 'Core API routes required for product to function',
          },
          webhookRoutes: {
            type: 'array',
            description: 'Webhook handlers required for integrations',
          },
          resourceRoutes: {
            type: 'object',
            description: 'CRUD routes for each resource',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const projectRoot = context.getCwd();

    // Default core API routes for SaaS
    const coreRoutes = options.coreRoutes || [
      { path: 'app/api/generate/route.ts', reason: 'core generation/creation feature' },
      { path: 'app/api/credits/route.ts', reason: 'credit system' },
      { path: 'app/api/checkout/route.ts', reason: 'payment checkout' },
    ];

    // Required webhooks
    const webhookRoutes = options.webhookRoutes || [
      { path: 'app/api/webhooks/stripe/route.ts', reason: 'Stripe payment events' },
    ];

    // Resource CRUD routes
    const resourceRoutes = options.resourceRoutes || {
      items: ['GET', 'POST'],  // List and create
      'items/[id]': ['GET', 'PATCH', 'DELETE'],  // Read, update, delete
    };

    let routesChecked = false;

    return {
      Program(node) {
        if (routesChecked) return;
        routesChecked = true;

        const fileName = context.getFilename();

        // Only check from API route files or root layout
        if (!fileName.includes('app/api/') && !fileName.includes('app/layout.tsx')) {
          return;
        }

        // Check core routes exist
        coreRoutes.forEach(({ path: routePath, reason }) => {
          const fullPath = path.join(projectRoot, routePath);
          if (!fs.existsSync(fullPath)) {
            context.report({
              node,
              messageId: 'missingCoreApi',
              data: {
                route: routePath,
                reason,
              },
            });
          }
        });

        // Check webhook routes exist
        webhookRoutes.forEach(({ path: webhookPath, reason }) => {
          const fullPath = path.join(projectRoot, webhookPath);
          if (!fs.existsSync(fullPath)) {
            context.report({
              node,
              messageId: 'missingWebhook',
              data: {
                webhook: webhookPath,
                reason,
              },
            });
          }
        });

        // Check resource CRUD completeness
        Object.entries(resourceRoutes).forEach(([resource, operations]) => {
          const resourcePath = path.join(projectRoot, 'app/api', resource);

          if (resource.includes('[id]')) {
            // Dynamic route
            const routeFile = path.join(resourcePath, 'route.ts');
            if (fs.existsSync(routeFile)) {
              const content = fs.readFileSync(routeFile, 'utf8');
              operations.forEach(operation => {
                const hasOperation = content.includes(`export async function ${operation}`);
                if (!hasOperation) {
                  context.report({
                    node,
                    messageId: 'missingCrudOperation',
                    data: {
                      resource,
                      operation,
                    },
                  });
                }
              });
            }
          }
        });
      },

      // Check API route files follow consistent pattern
      ExportNamedDeclaration(node) {
        const fileName = context.getFilename();

        if (!fileName.includes('app/api/') || !fileName.includes('route.ts')) {
          return;
        }

        // Check if it's an HTTP method export (GET, POST, etc.)
        if (node.declaration &&
            node.declaration.type === 'FunctionDeclaration' &&
            ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(node.declaration.id.name)) {

          const functionBody = node.declaration.body;

          // Check for try-catch
          const hasTryCatch = functionBody.body.some(statement =>
            statement.type === 'TryStatement'
          );

          if (!hasTryCatch) {
            context.report({
              node,
              messageId: 'inconsistentApiPattern',
              data: {
                route: fileName,
              },
            });
          }
        }
      },
    };
  },
};
