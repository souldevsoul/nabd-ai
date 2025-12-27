/**
 * ESLint Rule: require-auth-aware-header
 *
 * Ensures Header component has authentication-aware UX logic
 * Shows different navigation/controls for logged-in vs logged-out users
 *
 * @author Senior QA Engineer
 * @date 2025-11-18
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Header must show different UX for authenticated vs unauthenticated users',
      category: 'UX Consistency',
      recommended: true,
    },
    messages: {
      missingAuthCheck: 'Header component missing authentication check (useSession, getServerSession, etc.)',
      missingConditionalRendering: 'Header should conditionally render different controls based on auth state',
      missingDashboardLink: 'Header missing link to dashboard/profile for authenticated users',
      missingLoginLink: 'Header missing login/signup links for unauthenticated users',
      missingLogoutButton: 'Header missing logout/sign-out button for authenticated users',
    },
    schema: [
      {
        type: 'object',
        properties: {
          authHooks: {
            type: 'array',
            items: { type: 'string' },
            default: ['useSession', 'useAuth', 'useUser'],
          },
          serverAuthFunctions: {
            type: 'array',
            items: { type: 'string' },
            default: ['getServerSession', 'auth'],
          },
          requireDashboardLink: {
            type: 'boolean',
            default: true,
          },
          requireLoginLinks: {
            type: 'boolean',
            default: true,
          },
          requireLogoutButton: {
            type: 'boolean',
            default: true,
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const authHooks = options.authHooks || ['useSession', 'useAuth', 'useUser'];
    const serverAuthFunctions = options.serverAuthFunctions || ['getServerSession', 'auth'];
    const requireDashboardLink = options.requireDashboardLink !== false;
    const requireLoginLinks = options.requireLoginLinks !== false;
    const requireLogoutButton = options.requireLogoutButton !== false;

    const filename = context.getFilename();

    // Only check main Header/Navbar component files (not hooks, data files, utils)
    const isMainHeaderComponent =
      (filename.includes('/Header.tsx') ||
       filename.includes('/Header.jsx') ||
       filename.includes('/components/header/') ||
       filename.includes('/Navbar') ||
       filename.includes('/navbar')) &&
      !filename.includes('/hook') &&
      !filename.includes('/data/') &&
      !filename.includes('/utils/') &&
      !filename.includes('.test.') &&
      !filename.includes('.spec.');

    if (!isMainHeaderComponent) {
      return {};
    }

    let hasAuthCheck = false;
    let hasConditionalRendering = false;
    let hasDashboardLink = false;
    let hasLoginLink = false;
    let hasLogoutButton = false;
    let sessionVariableName = null;

    return {
      // Check for auth hook usage
      CallExpression(node) {
        if (node.callee.name && authHooks.includes(node.callee.name)) {
          hasAuthCheck = true;

          // Try to get session variable name
          const parent = node.parent;
          if (parent.type === 'VariableDeclarator' && parent.id.type === 'ObjectPattern') {
            parent.id.properties.forEach(prop => {
              if (prop.key.name === 'data' && prop.value.name) {
                sessionVariableName = prop.value.name;
              }
            });
          }
        }

        // Check for server-side auth
        if (node.callee.name && serverAuthFunctions.includes(node.callee.name)) {
          hasAuthCheck = true;
        }
      },

      // Check for await getServerSession() or await auth()
      AwaitExpression(node) {
        if (node.argument.type === 'CallExpression' && node.argument.callee.name) {
          if (serverAuthFunctions.includes(node.argument.callee.name)) {
            hasAuthCheck = true;
          }
        }
      },

      // Check for conditional rendering based on session
      ConditionalExpression(node) {
        const source = context.getSourceCode();
        const testCode = source.getText(node.test);

        // Check if condition uses session
        if (sessionVariableName && testCode.includes(sessionVariableName)) {
          hasConditionalRendering = true;
        }

        // Check for common patterns
        if (testCode.match(/session|user|isAuthenticated|isLoggedIn|auth/i)) {
          hasConditionalRendering = true;
        }
      },

      // Check for logical expressions (session && <Component>)
      LogicalExpression(node) {
        if (node.operator === '&&' || node.operator === '||') {
          const source = context.getSourceCode();
          const leftCode = source.getText(node.left);

          if (sessionVariableName && leftCode.includes(sessionVariableName)) {
            hasConditionalRendering = true;
          }

          if (leftCode.match(/session|user|isAuthenticated|isLoggedIn/i)) {
            hasConditionalRendering = true;
          }
        }
      },

      // Check for JSX links and buttons
      JSXElement(node) {
        const source = context.getSourceCode();
        const elementCode = source.getText(node);

        // Check for dashboard/profile links
        if (elementCode.match(/href=["']\/dashboard|\/profile|\/account/i)) {
          hasDashboardLink = true;
        }

        // Check for login/signup links
        if (elementCode.match(/href=["']\/login|\/signin|\/signup|\/register/i)) {
          hasLoginLink = true;
        }

        // Check for logout/signout button
        if (elementCode.match(/signOut|logout|sign out|log out/i)) {
          hasLogoutButton = true;
        }
      },

      'Program:exit'() {
        // Report missing auth check
        if (!hasAuthCheck) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingAuthCheck',
          });
        }

        // Report missing conditional rendering
        if (hasAuthCheck && !hasConditionalRendering) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingConditionalRendering',
          });
        }

        // Report missing dashboard link
        if (requireDashboardLink && !hasDashboardLink) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingDashboardLink',
          });
        }

        // Report missing login links
        if (requireLoginLinks && !hasLoginLink) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingLoginLink',
          });
        }

        // Report missing logout button
        if (requireLogoutButton && !hasLogoutButton) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingLogoutButton',
          });
        }
      },
    };
  },
};
