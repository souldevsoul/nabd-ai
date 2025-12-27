/**
 * ESLint Rule: require-credit-system
 *
 * Ensures credit purchase system is implemented with:
 * - Credit balance display for users
 * - Buy/Purchase credits functionality
 * - Stripe integration
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
      description: 'Ensure credit purchase system is fully implemented',
      category: 'Business Logic',
      recommended: true,
    },
    messages: {
      missingCreditsRoute: 'Missing /credits or /dashboard/credits page for credit management',
      missingCreditBalanceDisplay: 'Dashboard/Header should display user credit balance',
      missingBuyCreditsButton: 'Missing "Buy Credits" or "Purchase" button in UI',
      missingStripeIntegration: 'Missing Stripe integration (no @stripe/stripe-js import found)',
      missingCreditAPI: 'Missing API route /api/credits for credit operations',
      missingPaymentAPI: 'Missing payment API routes (/api/payments or /api/checkout)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireCreditsPage: {
            type: 'boolean',
            default: true,
          },
          requireBalanceDisplay: {
            type: 'boolean',
            default: true,
          },
          requirePurchaseUI: {
            type: 'boolean',
            default: true,
          },
          requireStripeIntegration: {
            type: 'boolean',
            default: false, // Payment integration is typically in lib/payment-config wrapper, not direct imports
          },
          requireCreditAPI: {
            type: 'boolean',
            default: true,
          },
          paymentProvider: {
            type: 'string',
            enum: ['stripe', 'ecommpay', 'both'],
            default: 'stripe',
          },
          excludePatterns: {
            type: 'array',
            items: { type: 'string' },
            default: [
              '/api/',
              'route.ts',
              'route.js',
              '.test.',
              '.spec.',
              'seed.ts',
              'seed.js',
              'next-env.d.ts',
              'next.config',
            ],
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const requireCreditsPage = options.requireCreditsPage !== false;
    const requireBalanceDisplay = options.requireBalanceDisplay !== false;
    const requirePurchaseUI = options.requirePurchaseUI !== false;
    const requireStripeIntegration = options.requireStripeIntegration === true; // Default false - payment wrappers are common
    const requireCreditAPI = options.requireCreditAPI !== false;
    const paymentProvider = options.paymentProvider || 'stripe';
    const excludePatterns = options.excludePatterns || [
      '/api/',
      'route.ts',
      'route.js',
      '.test.',
      '.spec.',
      'seed.ts',
      'seed.js',
      'next-env.d.ts',
      'next.config',
    ];

    const filename = context.getFilename();
    const cwd = context.getCwd();

    // Check if file should be excluded
    const shouldExclude = excludePatterns.some((pattern) => {
      if (pattern.startsWith('/') && pattern.endsWith('/')) {
        return filename.includes(pattern);
      }
      return filename.includes(pattern);
    });

    if (shouldExclude) {
      return {};
    }

    // Only run on main Dashboard/Header components or credits pages (not hooks, data, utils)
    const isMainComponent =
      (filename.includes('/Dashboard.tsx') ||
       filename.includes('/Dashboard.jsx') ||
       filename.includes('/Header.tsx') ||
       filename.includes('/Header.jsx') ||
       filename.includes('/credits/page.tsx') ||
       filename.includes('/credits/page.jsx') ||
       filename.includes('/Credits')) &&
      !filename.includes('/hook') &&
      !filename.includes('/data/') &&
      !filename.includes('/utils/');

    if (!isMainComponent) {
      return {};
    }

    let hasBalanceDisplay = false;
    let hasBuyCreditsButton = false;
    let hasStripeImport = false;

    return {
      // Check for Stripe/payment provider imports
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (requireStripeIntegration && paymentProvider === 'stripe') {
          if (importSource.includes('@stripe/stripe-js') ||
              importSource.includes('stripe')) {
            hasStripeImport = true;
          }
        }

        if (paymentProvider === 'ecommpay') {
          // Check for EcommPay integration
          if (importSource.includes('ecommpay') ||
              importSource.includes('payment')) {
            hasStripeImport = true; // Using same flag for any payment provider
          }
        }
      },

      // Check for credit balance display
      JSXElement(node) {
        const source = context.getSourceCode();
        const elementCode = source.getText(node);

        // Check for balance/credit display
        if (elementCode.match(/credit|balance|credits/i)) {
          const attributes = node.openingElement.attributes || [];
          const hasBalanceText = attributes.some(attr => {
            if (attr.value?.value) {
              return attr.value.value.match(/balance|credits/i);
            }
            return false;
          });

          if (hasBalanceText || elementCode.match(/\{.*credit.*\}/i)) {
            hasBalanceDisplay = true;
          }
        }

        // Check for Buy/Purchase buttons
        if (elementCode.match(/buy.*credit|purchase.*credit|add.*credit/i)) {
          hasBuyCreditsButton = true;
        }
      },

      // Check JSX text for credit-related content
      JSXText(node) {
        const text = node.value.toLowerCase();

        if (text.match(/credit|balance/)) {
          hasBalanceDisplay = true;
        }

        if (text.match(/buy.*credit|purchase|add.*credit/)) {
          hasBuyCreditsButton = true;
        }
      },

      'Program:exit'() {
        // Check for credits page existence
        if (requireCreditsPage) {
          const creditsPagePaths = [
            path.join(cwd, 'src/app/credits/page.tsx'),
            path.join(cwd, 'src/app/credits/page.jsx'),
            path.join(cwd, 'app/credits/page.tsx'),
            path.join(cwd, 'app/credits/page.jsx'),
            path.join(cwd, 'src/app/dashboard/credits/page.tsx'),
            path.join(cwd, 'src/app/dashboard/credits/page.jsx'),
            path.join(cwd, 'app/dashboard/credits/page.tsx'),
            path.join(cwd, 'app/dashboard/credits/page.jsx'),
          ];

          const creditsPageExists = creditsPagePaths.some(p => fs.existsSync(p));

          if (!creditsPageExists) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCreditsRoute',
            });
          }
        }

        // Check for Credit API routes
        if (requireCreditAPI) {
          const creditAPIPaths = [
            path.join(cwd, 'src/app/api/credits/route.ts'),
            path.join(cwd, 'src/app/api/credits/route.js'),
            path.join(cwd, 'app/api/credits/route.ts'),
            path.join(cwd, 'app/api/credits/route.js'),
          ];

          const creditAPIExists = creditAPIPaths.some(p => fs.existsSync(p));

          if (!creditAPIExists) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCreditAPI',
            });
          }
        }

        // Check for Payment API routes
        const paymentAPIPaths = [
          path.join(cwd, 'src/app/api/payments/route.ts'),
          path.join(cwd, 'src/app/api/payments/route.js'),
          path.join(cwd, 'app/api/payments/route.ts'),
          path.join(cwd, 'app/api/payments/route.js'),
          path.join(cwd, 'src/app/api/checkout/route.ts'),
          path.join(cwd, 'src/app/api/checkout/route.js'),
          path.join(cwd, 'app/api/checkout/route.ts'),
          path.join(cwd, 'app/api/checkout/route.js'),
        ];

        const paymentAPIExists = paymentAPIPaths.some(p => fs.existsSync(p));

        if (!paymentAPIExists) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingPaymentAPI',
          });
        }

        // Check for balance display in Dashboard/Header files
        if (requireBalanceDisplay &&
            (filename.includes('Dashboard') || filename.includes('Header')) &&
            !hasBalanceDisplay) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingCreditBalanceDisplay',
          });
        }

        // Check for Buy Credits button
        if (requirePurchaseUI && !hasBuyCreditsButton &&
            (filename.includes('credits') || filename.includes('Credits'))) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingBuyCreditsButton',
          });
        }

        // Check for Stripe integration
        if (requireStripeIntegration && !hasStripeImport &&
            (filename.includes('credits') || filename.includes('payment'))) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingStripeIntegration',
          });
        }
      },
    };
  },
};
