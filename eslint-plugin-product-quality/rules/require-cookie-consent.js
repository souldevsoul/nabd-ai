/**
 * ESLint Rule: require-cookie-consent
 *
 * Ensures all sites have standard cookie consent banner/modal
 * Required for GDPR, CCPA compliance
 *
 * @author Senior QA Engineer
 * @date 2025-11-18
 */

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure cookie consent banner is implemented on all sites',
      category: 'Legal Compliance',
      recommended: true,
    },
    messages: {
      missingCookieConsentComponent: 'Missing CookieConsent component file',
      missingCookieConsentInLayout: 'Root layout must include CookieConsent component',
      missingCookieConsentImport: 'Root layout missing CookieConsent import',
      missingCookieConsentRendering: 'CookieConsent component imported but not rendered',
      missingCookiePolicy: 'Missing /cookies or /cookie-policy page',
      missingCookieStorageLogic: 'CookieConsent component missing localStorage/cookie logic for user choice',
      missingAcceptButton: 'CookieConsent missing "Accept" or "Accept All" button',
      missingDeclineButton: 'CookieConsent missing "Decline" or "Reject" button (GDPR requirement)',
      missingPolicyLink: 'CookieConsent missing link to cookie policy page',
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireComponent: {
            type: 'boolean',
            default: true,
          },
          requireInLayout: {
            type: 'boolean',
            default: true,
          },
          requireCookiePolicy: {
            type: 'boolean',
            default: true,
          },
          requireDeclineButton: {
            type: 'boolean',
            default: true, // GDPR requires ability to decline
          },
          requirePolicyLink: {
            type: 'boolean',
            default: true,
          },
          componentName: {
            type: 'string',
            default: 'CookieConsent',
          },
          componentPaths: {
            type: 'array',
            items: { type: 'string' },
            default: [
              'components/CookieConsent',
              'components/cookies/CookieConsent',
              'components/CookieBanner',
            ],
          },
          excludePatterns: {
            type: 'array',
            items: { type: 'string' },
            default: [
              '/api/',
              'route.ts',
              'route.js',
              'seed.ts',
              'seed.js',
              'next-env.d.ts',
              'next.config',
              'middleware.ts',
              'middleware.js',
              'instrumentation.ts',
              'instrumentation.js',
              '.test.',
              '.spec.',
            ],
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const requireComponent = options.requireComponent !== false;
    const requireInLayout = options.requireInLayout !== false;
    const requireCookiePolicy = options.requireCookiePolicy !== false;
    const requireDeclineButton = options.requireDeclineButton !== false;
    const requirePolicyLink = options.requirePolicyLink !== false;
    const componentName = options.componentName || 'CookieConsent';
    const componentPaths = options.componentPaths || [
      'components/CookieConsent',
      'components/cookies/CookieConsent',
      'components/CookieBanner',
    ];
    const excludePatterns = options.excludePatterns || [
      '/api/',
      'route.ts',
      'route.js',
      'seed.ts',
      'seed.js',
      'next-env.d.ts',
      'next.config',
      'middleware.ts',
      'middleware.js',
      'instrumentation.ts',
      'instrumentation.js',
      '.test.',
      '.spec.',
    ];

    const filename = context.getFilename();
    const cwd = context.getCwd();

    // Check if file should be excluded
    const shouldExclude = excludePatterns.some((pattern) => {
      if (pattern.startsWith('/') && pattern.endsWith('/')) {
        // Path pattern like /api/
        return filename.includes(pattern);
      }
      // File pattern like route.ts
      return filename.includes(pattern);
    });

    if (shouldExclude) {
      return {};
    }

    // Check if this is a CookieConsent component file
    const isCookieConsentComponent =
      filename.includes('CookieConsent') ||
      filename.includes('CookieBanner') ||
      filename.includes('cookies/');

    // Check if this is root layout
    const isRootLayout =
      filename.includes('app/layout.tsx') ||
      filename.includes('app/layout.jsx') ||
      filename.includes('src/app/layout.tsx') ||
      filename.includes('src/app/layout.jsx');

    let hasCookieConsentImport = false;
    let hasCookieConsentInJSX = false;
    let hasAcceptButton = false;
    let hasDeclineButton = false;
    let hasPolicyLink = false;
    let hasStorageLogic = false;

    return {
      // Check imports in root layout
      ImportDeclaration(node) {
        if (!isRootLayout) return;

        const importSource = node.source.value;

        if (
          importSource.includes('CookieConsent') ||
          importSource.includes('CookieBanner')
        ) {
          hasCookieConsentImport = true;
        }
      },

      // Check JSX in root layout
      JSXElement(node) {
        const source = context.getSourceCode();
        const elementCode = source.getText(node);

        // In root layout: check if CookieConsent is rendered
        if (isRootLayout) {
          const elementName = node.openingElement.name.name;

          if (
            elementName === componentName ||
            elementName === 'CookieConsent' ||
            elementName === 'CookieBanner'
          ) {
            hasCookieConsentInJSX = true;
          }
        }

        // In CookieConsent component: check for required elements
        if (isCookieConsentComponent) {
          // Check for Accept button
          if (
            elementCode.match(
              /accept|agree|got it|okay|continue/i
            )
          ) {
            hasAcceptButton = true;
          }

          // Check for Decline button
          if (
            elementCode.match(/decline|reject|refuse|deny/i)
          ) {
            hasDeclineButton = true;
          }

          // Check for policy link
          if (
            elementCode.match(/href=[\"']\/(cookies|cookie-policy)/i) ||
            elementCode.match(/cookie.*policy|privacy.*policy/i)
          ) {
            hasPolicyLink = true;
          }
        }
      },

      // Check for localStorage/cookie logic in CookieConsent
      CallExpression(node) {
        if (!isCookieConsentComponent) return;

        const source = context.getSourceCode();
        const code = source.getText(node);

        // Check for localStorage.setItem or cookie setting
        if (
          code.includes('localStorage.setItem') ||
          code.includes('localStorage.getItem') ||
          code.includes('document.cookie') ||
          code.includes('setCookie') ||
          code.includes('getCookie') ||
          code.includes('Cookies.set') ||
          code.includes('Cookies.get')
        ) {
          hasStorageLogic = true;
        }
      },

      'Program:exit'() {
        // Check 1: Cookie Consent component exists (only check in root layout to avoid duplicates)
        if (isRootLayout && requireComponent) {
          const componentExists = componentPaths.some(p => {
            const tsxPath = path.join(cwd, `${p}.tsx`);
            const jsxPath = path.join(cwd, `${p}.jsx`);
            return fs.existsSync(tsxPath) || fs.existsSync(jsxPath);
          });

          if (!componentExists) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCookieConsentComponent',
            });
          }
        }

        // Check 2: Cookie Policy page exists (only check in root layout to avoid duplicates)
        if (isRootLayout && requireCookiePolicy) {
          const policyPaths = [
            path.join(cwd, 'app/cookies/page.tsx'),
            path.join(cwd, 'app/cookies/page.jsx'),
            path.join(cwd, 'app/cookie-policy/page.tsx'),
            path.join(cwd, 'app/cookie-policy/page.jsx'),
            path.join(cwd, 'src/app/cookies/page.tsx'),
            path.join(cwd, 'src/app/cookies/page.jsx'),
            path.join(cwd, 'src/app/cookie-policy/page.tsx'),
            path.join(cwd, 'src/app/cookie-policy/page.jsx'),
          ];

          const policyExists = policyPaths.some(p => fs.existsSync(p));

          if (!policyExists) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCookiePolicy',
            });
          }
        }

        // Check 3: Root layout has CookieConsent
        if (isRootLayout && requireInLayout) {
          if (!hasCookieConsentImport) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCookieConsentInLayout',
            });
          } else if (!hasCookieConsentInJSX) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCookieConsentRendering',
            });
          }
        }

        // Check 4: CookieConsent component has required elements
        if (isCookieConsentComponent) {
          if (!hasStorageLogic) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCookieStorageLogic',
            });
          }

          if (!hasAcceptButton) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingAcceptButton',
            });
          }

          if (requireDeclineButton && !hasDeclineButton) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingDeclineButton',
            });
          }

          if (requirePolicyLink && !hasPolicyLink) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingPolicyLink',
            });
          }
        }
      },
    };
  },
};
