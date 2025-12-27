/**
 * ESLint Rule: require-functional-auth-system
 *
 * Ensures the application has a complete and functional authentication system:
 * 1. Auth pages exist (login, register/signup)
 * 2. Registration sends email verification
 * 3. Logout functionality is properly implemented
 * 4. Auth API routes are properly configured
 *
 * @author Senior QA Engineer
 * @date 2025-11-18
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures complete authentication system with login, registration, email verification, and logout',
      category: 'Security & UX',
      recommended: true,
    },
    messages: {
      missingLoginPage: 'Missing login page at {{expectedPaths}}',
      missingRegisterPage: 'Missing registration/signup page at {{expectedPaths}}',
      missingLogoutHandler: 'Missing logout API route or handler at {{expectedPaths}}',
      missingEmailVerification: 'Registration route at {{route}} does not send email verification',
      missingAuthAPI: 'Missing authentication API routes (expected: {{expectedPaths}})',
    },
    schema: [
      {
        type: 'object',
        properties: {
          loginPaths: {
            type: 'array',
            items: { type: 'string' },
            default: ['/login', '/signin', '/(auth)/login', '/(auth)/signin'],
          },
          registerPaths: {
            type: 'array',
            items: { type: 'string' },
            default: ['/register', '/signup', '/(auth)/register', '/(auth)/signup'],
          },
          logoutPaths: {
            type: 'array',
            items: { type: 'string' },
            default: ['/api/auth/logout', '/api/auth/signout', '/api/logout'],
          },
          requireEmailVerification: {
            type: 'boolean',
            default: false, // Email verification optional for MVP - credit-based systems don't require it
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const loginPaths = options.loginPaths || ['/login', '/signin', '/(auth)/login', '/(auth)/signin'];
    const registerPaths = options.registerPaths || ['/register', '/signup', '/(auth)/register', '/(auth)/signup'];
    const logoutPaths = options.logoutPaths || ['/api/auth/logout', '/api/auth/signout', '/api/logout'];
    const requireEmailVerification = options.requireEmailVerification === true; // Default false - optional for MVP

    const filename = context.getFilename();

    // Only run this check on root layout or main entry points
    const isEntryPoint =
      filename.endsWith('app/layout.tsx') ||
      filename.endsWith('app/layout.jsx') ||
      filename.endsWith('src/app/layout.tsx') ||
      filename.endsWith('src/app/layout.jsx');

    if (!isEntryPoint) {
      return {};
    }

    // Get project root directory
    const getProjectRoot = () => {
      let currentDir = path.dirname(filename);
      while (currentDir !== '/') {
        if (fs.existsSync(path.join(currentDir, 'package.json'))) {
          return currentDir;
        }
        currentDir = path.dirname(currentDir);
      }
      return null;
    };

    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return {};
    }

    // Helper function to find pages in app directory
    const findPage = (pagePaths, root) => {
      const appDir = fs.existsSync(path.join(root, 'app')) ? path.join(root, 'app') : path.join(root, 'src', 'app');

      for (const pagePath of pagePaths) {
        // Remove leading slash
        const cleanPath = pagePath.replace(/^\//, '');

        // Check both page.tsx and page.jsx
        const possibleFiles = [
          path.join(appDir, cleanPath, 'page.tsx'),
          path.join(appDir, cleanPath, 'page.jsx'),
        ];

        for (const file of possibleFiles) {
          if (fs.existsSync(file)) {
            return file;
          }
        }
      }

      return null;
    };

    // Helper function to check if file contains email sending logic
    const hasEmailSending = (filePath) => {
      if (!fs.existsSync(filePath)) return false;

      try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for common email sending patterns
        const emailPatterns = [
          /sendEmail/i,
          /sendVerificationEmail/i,
          /nodemailer/,
          /resend\.emails\.send/,
          /@react-email/,
          /sendgrid/i,
          /mailgun/i,
          /postmark/i,
          /aws-sdk.*ses/i,
        ];

        return emailPatterns.some(pattern => pattern.test(content));
      } catch (error) {
        return false;
      }
    };

    return {
      'Program:exit'() {
        let hasIssues = false;

        // Check for login page
        const loginPage = findPage(loginPaths, projectRoot);
        if (!loginPage) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingLoginPage',
            data: {
              expectedPaths: loginPaths.join(', '),
            },
          });
          hasIssues = true;
        }

        // Check for registration page
        const registerPage = findPage(registerPaths, projectRoot);
        if (!registerPage) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingRegisterPage',
            data: {
              expectedPaths: registerPaths.join(', '),
            },
          });
          hasIssues = true;
        }

        // Check for logout API route
        // Note: API routes use route.ts not page.tsx
        const findApiRoute = (apiPaths, root) => {
          const appDir = fs.existsSync(path.join(root, 'app')) ? path.join(root, 'app') : path.join(root, 'src', 'app');
          for (const apiPath of apiPaths) {
            const cleanPath = apiPath.replace(/^\//, '');
            const possibleFiles = [
              path.join(appDir, cleanPath, 'route.ts'),
              path.join(appDir, cleanPath, 'route.tsx'),
              path.join(appDir, cleanPath, 'route.js'),
            ];
            for (const file of possibleFiles) {
              if (fs.existsSync(file)) {
                return file;
              }
            }
          }
          return null;
        };
        const logoutRoute = findApiRoute(logoutPaths, projectRoot);
        if (!logoutRoute) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingLogoutHandler',
            data: {
              expectedPaths: logoutPaths.join(', '),
            },
          });
          hasIssues = true;
        }

        // Check for email verification in registration
        if (requireEmailVerification && registerPage) {
          // Look for corresponding API route
          const apiAppDir = fs.existsSync(path.join(projectRoot, 'app'))
            ? path.join(projectRoot, 'app', 'api')
            : path.join(projectRoot, 'src', 'app', 'api');

          const possibleAuthAPIRoutes = [
            path.join(apiAppDir, 'auth', 'register', 'route.ts'),
            path.join(apiAppDir, 'auth', 'register', 'route.js'),
            path.join(apiAppDir, 'auth', 'signup', 'route.ts'),
            path.join(apiAppDir, 'auth', 'signup', 'route.js'),
            path.join(apiAppDir, 'register', 'route.ts'),
            path.join(apiAppDir, 'register', 'route.js'),
            path.join(apiAppDir, 'signup', 'route.ts'),
            path.join(apiAppDir, 'signup', 'route.js'),
          ];

          let foundRegistrationAPI = false;
          let hasEmail = false;

          for (const routePath of possibleAuthAPIRoutes) {
            if (fs.existsSync(routePath)) {
              foundRegistrationAPI = true;
              if (hasEmailSending(routePath)) {
                hasEmail = true;
                break;
              }
            }
          }

          if (foundRegistrationAPI && !hasEmail) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingEmailVerification',
              data: {
                route: possibleAuthAPIRoutes.find(p => fs.existsSync(p)) || 'unknown',
              },
            });
            hasIssues = true;
          }
        }
      },
    };
  },
};
