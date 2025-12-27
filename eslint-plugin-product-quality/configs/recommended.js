/**
 * Recommended configuration for AutoQA ESLint Plugin
 *
 * Core rules that every SaaS project should use.
 * Balanced between strictness and practicality.
 *
 * @version 1.29.0
 */

module.exports = {
  plugins: ['product-quality'],
  rules: {
    // ========================================
    // CRITICAL - Must pass for production
    // ========================================

    // Content & Brand
    'product-quality/consistent-company-info': 'error',
    'product-quality/no-fake-content': 'error',
    'product-quality/no-generic-placeholders': 'error',
    'product-quality/require-brand-import': 'warn',

    // Legal & Compliance
    'product-quality/require-legal-pages-exist': 'error',
    'product-quality/require-cookie-consent': 'error',
    'product-quality/require-legal-pages-plain-format': 'warn',

    // Payment Compliance
    'product-quality/no-b2b-language': 'error',
    'product-quality/no-vat-number-display': 'error',
    'product-quality/no-acquirer-name-display': 'error',
    'product-quality/require-discount-limits': 'warn',
    'product-quality/require-payment-logo-compliance': 'warn',

    // ========================================
    // UX & Accessibility
    // ========================================

    'product-quality/no-missing-alt-text': 'error',
    'product-quality/require-aria-label-on-icon-buttons': 'error',
    'product-quality/require-accessible-forms': 'error',
    'product-quality/require-focus-visible': 'warn',
    'product-quality/require-proper-heading-hierarchy': 'warn',

    // ARIA Validation (v1.20.0)
    'product-quality/require-valid-aria-props': 'error',
    'product-quality/no-positive-tabindex': 'error',
    'product-quality/no-redundant-roles': 'warn',

    // ========================================
    // SEO & Performance
    // ========================================

    'product-quality/require-seo-metadata': 'error',
    'product-quality/require-unique-page-titles': 'error',
    'product-quality/require-page-metadata': 'warn',
    'product-quality/require-image-optimization': 'warn',
    'product-quality/require-responsive-images': 'warn',

    // ========================================
    // Code Quality
    // ========================================

    'product-quality/no-console-logs-production': 'error',
    'product-quality/no-hardcoded-api-urls': 'error',
    'product-quality/require-try-catch-fetch': 'warn',
    'product-quality/require-error-boundaries': 'warn',
    'product-quality/require-loading-states': 'warn',

    // ========================================
    // Security (v1.19.0)
    // ========================================

    'product-quality/no-eval': 'error',
    'product-quality/no-unsafe-regex': 'error',
    'product-quality/no-child-process-exec': 'error',
    'product-quality/no-object-injection': 'warn',

    // ========================================
    // Layout & Navigation
    // ========================================

    'product-quality/require-consistent-layout': 'error',
    'product-quality/require-navigation-in-header': 'error',
    'product-quality/require-logo-links-home': 'warn',
    'product-quality/no-broken-internal-links': 'error',

    // ========================================
    // Modern UX Best Practices (v1.14.0)
    // ========================================

    'product-quality/require-hero-section': 'warn',
    'product-quality/require-single-cta-focus': 'warn',
    'product-quality/require-social-proof-section': 'warn',
    'product-quality/require-value-proposition': 'warn',
    'product-quality/require-trust-signals': 'warn',
    'product-quality/no-wall-of-text': 'warn',

    // ========================================
    // Auth Component Consistency (v1.22.0)
    // ========================================

    'product-quality/require-logout-in-authenticated-layouts': 'error',
    'product-quality/require-logo-component-in-layouts': 'warn',

    // ========================================
    // Auth Middleware Protection (v1.23.0)
    // ========================================

    'product-quality/require-auth-middleware': 'error',

    // ========================================
    // Auth Security Rules (v1.24.0)
    // ========================================

    'product-quality/no-hardcoded-user-id': 'error',
    'product-quality/require-session-provider': 'warn',

    // ========================================
    // Next.js & UX Rules (v1.25.0)
    // ========================================

    'product-quality/require-suspense-for-search-params': 'error',
    'product-quality/no-alert-calls': 'error',

    // ========================================
    // Extended A11y Rules (v1.27.0)
    // ========================================

    'product-quality/anchor-has-content': 'error',
    'product-quality/anchor-is-valid': 'error',
    'product-quality/click-events-have-key-events': 'warn',
    'product-quality/img-redundant-alt': 'warn',
    'product-quality/mouse-events-have-key-events': 'warn',

    // ========================================
    // Payment Compliance Rules (v1.28.0)
    // ========================================

    'product-quality/no-free-credits-mentions': 'error',
    'product-quality/no-subscription-language': 'warn',
    'product-quality/no-unverified-statistics': 'warn',
    'product-quality/no-digital-wallet-mentions': 'error',
  },
};
