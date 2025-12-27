/**
 * @fileoverview Ensures admin panel exists for user/content management
 * @author AutoQA
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures admin panel exists with user management, analytics, and content moderation',
      category: 'Completeness',
      recommended: true,
    },
    messages: {
      noAdminPanel: 'No admin panel found. Create /admin with at minimum: dashboard, user management, and transaction tracking.',
      missingUserManagement: 'Admin panel exists but missing /admin/users page. Cannot manage users, ban accounts, or add credits.',
      missingTransactions: 'Admin panel exists but missing /admin/transactions page. Cannot track revenue or refund transactions.',
      missingAnalytics: 'Admin panel exists but missing analytics/metrics. Create /admin/analytics or add metrics to /admin dashboard.',
      adminNotProtected: 'Admin routes exist but middleware doesn\'t protect them. Add role/permission check in middleware.ts.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireAdmin: {
            type: 'boolean',
            description: 'Whether admin panel is required',
            default: true,
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const requireAdmin = options.requireAdmin !== false; // Default true
    const projectRoot = context.getCwd();

    let checked = false;

    return {
      Program(node) {
        if (checked || !requireAdmin) return;
        checked = true;

        const fileName = context.getFilename();

        // Only check from root layout
        if (!fileName.includes('app/layout.tsx')) {
          return;
        }

        // Check if admin directory exists
        const adminPath = path.join(projectRoot, 'app/admin');
        if (!fs.existsSync(adminPath)) {
          context.report({
            node,
            messageId: 'noAdminPanel',
          });
          return;
        }

        // Admin exists, check required pages
        const adminDashboard = path.join(projectRoot, 'app/admin/page.tsx');
        const adminUsers = path.join(projectRoot, 'app/admin/users/page.tsx');
        const adminTransactions = path.join(projectRoot, 'app/admin/transactions/page.tsx');
        const adminAnalytics = path.join(projectRoot, 'app/admin/analytics/page.tsx');

        if (!fs.existsSync(adminUsers)) {
          context.report({
            node,
            messageId: 'missingUserManagement',
          });
        }

        if (!fs.existsSync(adminTransactions)) {
          context.report({
            node,
            messageId: 'missingTransactions',
          });
        }

        // Check if dashboard has metrics or separate analytics page exists
        const hasAnalytics = fs.existsSync(adminAnalytics);
        const hasDashboardMetrics = fs.existsSync(adminDashboard) &&
          fs.readFileSync(adminDashboard, 'utf8').match(/total.*users|revenue|metrics|stats/i);

        if (!hasAnalytics && !hasDashboardMetrics) {
          context.report({
            node,
            messageId: 'missingAnalytics',
          });
        }

        // Check middleware protects admin routes
        const middlewarePath = path.join(projectRoot, 'middleware.ts');
        if (fs.existsSync(middlewarePath)) {
          const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
          const protectsAdmin = middlewareContent.includes('/admin') ||
                               middlewareContent.includes('admin') ||
                               middlewareContent.includes('role') ||
                               middlewareContent.includes('isAdmin');

          if (!protectsAdmin) {
            context.report({
              node,
              messageId: 'adminNotProtected',
            });
          }
        }
      },
    };
  },
};
