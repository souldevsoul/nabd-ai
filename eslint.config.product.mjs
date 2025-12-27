import tsParser from '@typescript-eslint/parser';
import productQuality from './eslint-plugin-product-quality/index.js';

/**
 * Product Quality ESLint Config - 99 RULES
 *
 * Brand: Photolectic
 * Email: support@photolectic.com
 * Colors: amber-, emerald-
 *
 * Verified Human Photography Marketplace
 * @version 1.0.0
 */
const eslintConfig = [
  {
    ignores: [
      'eslint-plugin-product-quality/**',
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
      'test-*.ts',
      'scripts/**', // Development scripts - not production code
      'check-*.js', // Utility scripts
      'lib/brand.ts', // Brand definition file - no need to import BRAND
      'lib/payment-config.ts', // Internal payment config - stripe reference required
      'lib/stripe.ts', // Stripe SDK initialization
      'lib/analytics.ts', // Analytics config
      'lib/web-vitals.ts', // Performance monitoring
      'lib/error-tracking.ts', // Error tracking config
      'app/api/checkout/**', // Payment API routes need stripe reference
      'app/api/webhooks/**', // Webhook handlers need stripe reference
      'app/api/invoices/**', // Invoice API needs stripe reference
      'prisma/**', // Prisma schema and migrations
      'components/three/**', // Three.js components have special patterns
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'product-quality': productQuality,
    },
    rules: {
      // ========================================
      // BRAND CONSISTENCY (7 rules)
      // ========================================
      'product-quality/use-styleguide-colors-only': ['error', {
        allowedColors: [
          'black', 'white', 'transparent', 'current', 'inherit',
          'gray-', 'slate-', 'zinc-', 'neutral-',
          'amber-', 'emerald-', // Photolectic brand colors
          'red-', 'green-', 'yellow-', 'orange-', // Semantic
          'foreground', 'background', 'muted', 'accent', 'primary', 'secondary', // Theme tokens
        ],
      }],
      'product-quality/no-brutalist-design': 'error',
      'product-quality/require-consistent-logo': 'error',
      'product-quality/require-text-color-contrast': 'error',
      'product-quality/consistent-company-info': ['error', {
        companyName: 'Photolectic',
        email: 'support@photolectic.com',
      }],
      'product-quality/consistent-payment-providers': ['error', {
        provider: 'stripe',
      }],
      'product-quality/require-brand-import': 'error',

      // ========================================
      // CONTENT QUALITY (11 rules)
      // ========================================
      'product-quality/no-fake-content': 'error',
      'product-quality/no-generic-placeholders': 'error',
      'product-quality/email-must-match-domain': 'error',
      'product-quality/no-social-media-links': 'error',
      'product-quality/no-blog-pages': 'error',
      'product-quality/no-ai-obvious-content': 'error',
      'product-quality/no-fake-testimonials-pre-launch': 'error',
      'product-quality/no-wall-of-text': 'error',
      'product-quality/require-blog-content-attribution': 'error',
      'product-quality/require-testimonial-disclaimer': 'error',
      'product-quality/no-unverified-statistics': 'error',

      // ========================================
      // UX CONSISTENCY (9 rules)
      // ========================================
      'product-quality/no-button-without-handler': 'error',
      'product-quality/no-form-without-submit': 'error',
      'product-quality/no-missing-alt-text': 'error',
      'product-quality/require-loading-state-on-async-button': 'error',
      'product-quality/require-aria-label-on-icon-buttons': 'error',
      'product-quality/require-empty-state': 'error',
      'product-quality/require-loading-states': 'error',
      'product-quality/require-accessible-forms': 'error',
      'product-quality/no-external-links-without-target': 'error',

      // ========================================
      // ACCESSIBILITY (10 rules)
      // ========================================
      'product-quality/no-autofocus': 'error',
      'product-quality/require-lang-attribute': 'error',
      'product-quality/require-valid-aria-props': 'error',
      'product-quality/no-positive-tabindex': 'error',
      'product-quality/no-redundant-roles': 'error',
      'product-quality/enforce-color-contrast': 'error',
      'product-quality/require-sufficient-contrast': 'error',
      'product-quality/anchor-has-content': 'error',
      'product-quality/anchor-is-valid': 'error',
      'product-quality/img-redundant-alt': 'error',

      // ========================================
      // NAVIGATION & HEADER (3 rules)
      // ========================================
      'product-quality/require-logo-links-home': 'error',
      'product-quality/require-navigation-in-header': 'error',
      'product-quality/require-auth-aware-header': 'error',

      // ========================================
      // LAYOUT & STRUCTURE (4 rules)
      // ========================================
      'product-quality/require-consistent-layout': ['error', {
        headerComponent: 'Header',
        footerComponent: 'Footer',
        excludePatterns: ['/api/', '/dashboard/', '/admin/', '/photographer/'],
      }],
      'product-quality/require-unique-page-titles': 'error',
      'product-quality/require-consistent-legal-page-design': 'error',
      'product-quality/require-logo-component-in-layouts': 'error',

      // ========================================
      // SECURITY (11 rules)
      // ========================================
      'product-quality/require-security-headers': 'error',
      'product-quality/no-hardcoded-api-urls': 'error',
      'product-quality/require-environment-variables': 'error',
      'product-quality/no-console': 'error',
      'product-quality/no-console-logs-production': 'error',
      'product-quality/require-try-catch-fetch': 'error',
      'product-quality/require-error-boundaries': 'error',
      'product-quality/no-eval': 'error',
      'product-quality/no-unsafe-regex': 'error',
      'product-quality/no-child-process-exec': 'error',
      'product-quality/require-input-sanitization': 'error',
      'product-quality/no-alert-calls': 'error',
      'product-quality/no-hardcoded-user-id': 'error',

      // ========================================
      // PERFORMANCE & OPTIMIZATION (3 rules)
      // ========================================
      'product-quality/require-image-optimization': 'error',
      'product-quality/require-responsive-images': 'error',
      'product-quality/require-mobile-responsive': 'error',

      // ========================================
      // SEO & MARKETING (1 rule)
      // ========================================
      'product-quality/require-seo-metadata': ['error', {
        excludePatterns: ['/api/', 'layout.tsx', 'route.ts', '.test.', '.spec.', '/admin/', '/dashboard/', '/photographer/'],
      }],

      // ========================================
      // PAYMENTS & LEGAL (17 rules)
      // ========================================
      'product-quality/require-payment-compliance': 'error',
      'product-quality/require-payment-logo-compliance': 'error',
      'product-quality/require-legal-pages-exist': 'error',
      'product-quality/require-legal-pages-plain-format': 'error',
      'product-quality/require-cookie-consent': 'error',
      'product-quality/require-invoice-management': 'error',
      'product-quality/no-b2b-language': 'error',
      'product-quality/no-vat-number-display': 'error',
      'product-quality/no-acquirer-name-display': 'error',
      'product-quality/require-discount-limits': 'error',
      'product-quality/require-physical-address-checkout': 'error',
      'product-quality/require-receipt-template-fields': 'error',
      'product-quality/require-card-payment-fairness': 'error',
      'product-quality/require-aml-kyc-policy': 'error',
      'product-quality/require-payment-logos-on-page': 'error',
      'product-quality/no-digital-wallet-mentions': 'error',
      'product-quality/no-free-credits-mentions': 'error',
      'product-quality/no-subscription-language': 'error',

      // ========================================
      // PRODUCT COMPLETENESS (8 rules)
      // ========================================
      'product-quality/require-complete-user-flow': 'error',
      'product-quality/require-complete-api-routes': 'error',
      'product-quality/require-dashboard-settings-complete': 'error',
      'product-quality/require-admin-panel': 'error',
      'product-quality/require-credit-system': 'error',
      'product-quality/require-functional-auth-system': 'error',
      'product-quality/require-auth-middleware': 'error',
      'product-quality/require-session-provider': 'error',

      // ========================================
      // DESIGN SYSTEM (5 rules)
      // ========================================
      'product-quality/require-tailwind-config-consistency': 'error',
      'product-quality/require-modern-saas-patterns': 'error',
      'product-quality/require-consistent-icon-library': 'error',
      'product-quality/no-emojis-in-ui': 'error',
      'product-quality/no-contradicting-tailwind-classes': 'error',

      // ========================================
      // MODERN UX BEST PRACTICES (3 rules)
      // ========================================
      'product-quality/require-hero-section': 'error',
      'product-quality/require-single-cta-focus': 'error',
      'product-quality/require-value-proposition': 'error',

      // ========================================
      // PROJECT QUALITY (3 rules)
      // ========================================
      'product-quality/require-project-isolation': ['error', {
        // Exclude 'photolectic' since this IS the Photolectic project
        templatePatterns: [
          'template', 'starter', 'boilerplate', 'example-app', 'demo-app',
          'my-app', 'your-app', 'acme', 'test-project',
          'voicecraft', 'voice craft', 'voice revolution', 'voice generation', 'voice templates',
          'clipmaster', 'clip master', 'formpilot', 'form pilot', 'logosmith', 'logo smith',
          'fashionforge', 'fashion forge', 'petportrait', 'pet portrait',
          'booktrailer', 'book trailer', 'propvideo', 'prop video',
          'tutorbot', 'tutor bot', 'coursify', 'datascope', 'flowmatic', 'reelmatic', 'nexus',
          'toonify', // Other projects to avoid contamination
          // 'photolectic' is intentionally excluded - this IS the Photolectic project
        ],
      }],
      'product-quality/require-roadmap-dating': 'error',
      'product-quality/require-expert-anonymization': 'error',

      // ========================================
      // INTERNAL LINKS (1 rule)
      // ========================================
      'product-quality/no-broken-internal-links': 'error',
    },
  },
];

export default eslintConfig;
