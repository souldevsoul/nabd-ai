/**
 * @fileoverview Ensures complete end-to-end user flow is implemented
 * @author AutoQA
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures all critical user pages exist and are properly connected for complete product flow',
      category: 'Completeness',
      recommended: true,
    },
    messages: {
      missingPage: 'Critical page "{{page}}" is missing. User flow incomplete without {{reason}}.',
      pageNotLinked: 'Page "{{page}}" exists but is not linked from {{from}}. Users cannot discover this page.',
      missingDashboardNav: 'Dashboard pages exist but navigation component is missing. Add sidebar/menu navigation.',
      incompleteSettingsPages: 'Incomplete user settings. Missing: {{missing}}. Required for complete account management.',
      missingAdminPanel: 'Admin panel pages missing. No way to manage users, content, or view analytics.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          requiredPages: {
            type: 'array',
            description: 'List of required pages for complete user flow',
          },
          dashboardPages: {
            type: 'array',
            description: 'Required dashboard pages',
          },
          settingsPages: {
            type: 'array',
            description: 'Required settings pages',
          },
          adminPages: {
            type: 'array',
            description: 'Required admin pages',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const projectRoot = context.getCwd();

    // Default required pages for complete SaaS
    const requiredPages = options.requiredPages || [
      { path: 'app/page.tsx', reason: 'landing page/homepage' },
      { path: 'app/pricing/page.tsx', reason: 'users need to see pricing' },
    ];

    const dashboardPages = options.dashboardPages || [
      { path: 'app/dashboard/page.tsx', reason: 'main dashboard view' },
      { path: 'app/dashboard/settings/page.tsx', reason: 'user settings' },
      { path: 'app/dashboard/settings/billing/page.tsx', reason: 'billing management' },
    ];

    const settingsPages = options.settingsPages || [
      'app/dashboard/settings/page.tsx',
      'app/dashboard/settings/billing/page.tsx',
      'app/dashboard/settings/account/page.tsx',
    ];

    const adminPages = options.adminPages || [
      'app/admin/page.tsx',
      'app/admin/users/page.tsx',
    ];

    let pagesChecked = false;

    return {
      Program(node) {
        // Only run once per file check
        if (pagesChecked) return;
        pagesChecked = true;

        const fileName = context.getFilename();

        // Only check from root layout or main entry points
        if (!fileName.includes('app/layout.tsx') && !fileName.includes('app/page.tsx')) {
          return;
        }

        // Check required pages exist
        requiredPages.forEach(({ path: pagePath, reason }) => {
          const fullPath = path.join(projectRoot, pagePath);
          if (!fs.existsSync(fullPath)) {
            context.report({
              node,
              messageId: 'missingPage',
              data: {
                page: pagePath,
                reason,
              },
            });
          }
        });

        // Check dashboard pages exist
        const missingDashboard = dashboardPages.filter(({ path: pagePath }) => {
          const fullPath = path.join(projectRoot, pagePath);
          return !fs.existsSync(fullPath);
        });

        missingDashboard.forEach(({ path: pagePath, reason }) => {
          context.report({
            node,
            messageId: 'missingPage',
            data: {
              page: pagePath,
              reason,
            },
          });
        });

        // Check if dashboard navigation exists
        const hasDashboard = fs.existsSync(path.join(projectRoot, 'app/dashboard'));
        if (hasDashboard) {
          const dashboardLayoutPath = path.join(projectRoot, 'app/dashboard/layout.tsx');
          const dashboardNavPaths = [
            path.join(projectRoot, 'components/dashboard/Sidebar.tsx'),
            path.join(projectRoot, 'components/dashboard/Navigation.tsx'),
            path.join(projectRoot, 'components/dashboard/DashboardNav.tsx'),
            path.join(projectRoot, 'components/DashboardSidebar.tsx'),
          ];

          const hasNavigation = dashboardNavPaths.some(p => fs.existsSync(p)) ||
                               (fs.existsSync(dashboardLayoutPath) &&
                                fs.readFileSync(dashboardLayoutPath, 'utf8').includes('nav'));

          if (!hasNavigation) {
            context.report({
              node,
              messageId: 'missingDashboardNav',
            });
          }
        }

        // Check settings pages completeness
        const existingSettings = settingsPages.filter(pagePath => {
          const fullPath = path.join(projectRoot, pagePath);
          return fs.existsSync(fullPath);
        });

        const missingSettings = settingsPages.filter(pagePath => {
          const fullPath = path.join(projectRoot, pagePath);
          return !fs.existsSync(fullPath);
        });

        if (existingSettings.length > 0 && missingSettings.length > 0) {
          context.report({
            node,
            messageId: 'incompleteSettingsPages',
            data: {
              missing: missingSettings.map(p => path.basename(path.dirname(p)) + '/' + path.basename(p)).join(', '),
            },
          });
        }

        // Check admin panel
        const hasAnyAdmin = adminPages.some(pagePath => {
          const fullPath = path.join(projectRoot, pagePath);
          return fs.existsSync(fullPath);
        });

        if (!hasAnyAdmin) {
          context.report({
            node,
            messageId: 'missingAdminPanel',
          });
        }
      },
    };
  },
};
