/**
 * Strict configuration for AutoQA ESLint Plugin
 *
 * All rules enabled as errors. Use for final pre-production validation.
 * May have false positives - review carefully.
 *
 * @version 1.29.0
 */

module.exports = {
  plugins: ['product-quality'],
  rules: {
    // All 114 rules as errors
    'product-quality/consistent-company-info': 'error',
    'product-quality/consistent-payment-providers': 'error',
    'product-quality/email-must-match-domain': 'error',
    'product-quality/enforce-color-contrast': 'error',
    'product-quality/no-acquirer-name-display': 'error',
    'product-quality/no-b2b-language': 'error',
    'product-quality/no-blog-pages': 'error',
    'product-quality/no-broken-internal-links': 'error',
    'product-quality/no-brutalist-design': 'error',
    'product-quality/no-button-without-handler': 'error',
    'product-quality/no-console': 'error',
    'product-quality/no-console-logs-production': 'error',
    'product-quality/no-emojis-in-ui': 'error',
    'product-quality/no-external-links-without-target': 'error',
    'product-quality/no-fake-content': 'error',
    'product-quality/no-form-without-submit': 'error',
    'product-quality/no-generic-placeholders': 'error',
    'product-quality/no-hardcoded-api-urls': 'error',
    'product-quality/no-inline-styles': 'error',
    'product-quality/no-missing-alt-text': 'error',
    'product-quality/no-social-media-links': 'error',
    'product-quality/no-vat-number-display': 'error',
    'product-quality/require-accessible-forms': 'error',
    'product-quality/require-admin-panel': 'error',
    'product-quality/require-appropriate-text-color-for-background': 'error',
    'product-quality/require-aria-label-on-icon-buttons': 'error',
    'product-quality/require-auth-aware-header': 'error',
    'product-quality/require-brand-import': 'error',
    'product-quality/require-complete-api-routes': 'error',
    'product-quality/require-complete-user-flow': 'error',
    'product-quality/require-consistent-icon-library': 'error',
    'product-quality/require-consistent-layout': 'error',
    'product-quality/require-consistent-legal-page-design': 'error',
    'product-quality/require-consistent-logo': 'error',
    'product-quality/require-consistent-spacing': 'error',
    'product-quality/require-cookie-consent': 'error',
    'product-quality/require-credit-system': 'error',
    'product-quality/require-currency-format': 'error',
    'product-quality/require-dashboard-settings-complete': 'error',
    'product-quality/require-discount-limits': 'error',
    'product-quality/require-empty-state': 'error',
    'product-quality/require-environment-variables': 'error',
    'product-quality/require-error-boundaries': 'error',
    'product-quality/require-focus-visible': 'error',
    'product-quality/require-functional-auth-system': 'error',
    'product-quality/require-hover-states': 'error',
    'product-quality/require-image-optimization': 'error',
    'product-quality/require-invoice-management': 'error',
    'product-quality/require-legal-pages-exist': 'error',
    'product-quality/require-legal-pages-plain-format': 'error',
    'product-quality/require-loading-state-on-async-button': 'error',
    'product-quality/require-loading-states': 'error',
    'product-quality/require-logo-links-home': 'error',
    'product-quality/require-mobile-responsive': 'error',
    'product-quality/require-modern-saas-patterns': 'error',
    'product-quality/require-navigation-in-header': 'error',
    'product-quality/require-page-metadata': 'error',
    'product-quality/require-payment-compliance': 'error',
    'product-quality/require-payment-logo-compliance': 'error',
    'product-quality/require-performance-monitoring': 'error',
    'product-quality/require-physical-address-checkout': 'error',
    'product-quality/require-proper-heading-hierarchy': 'error',
    'product-quality/require-proper-page-structure': 'error',
    'product-quality/require-receipt-template-fields': 'error',
    'product-quality/require-responsive-images': 'error',
    'product-quality/require-schema-markup': 'error',
    'product-quality/require-security-headers': 'error',
    'product-quality/require-seo-meta-tags': 'error',
    'product-quality/require-seo-metadata': 'error',
    'product-quality/require-sufficient-contrast': 'error',
    'product-quality/require-support-contact-complete': 'error',
    'product-quality/require-tailwind-config-consistency': 'error',
    'product-quality/require-testimonial-disclaimer': 'error',
    'product-quality/require-text-color-contrast': 'error',
    'product-quality/require-try-catch-fetch': 'error',
    'product-quality/require-unique-page-titles': 'error',
    'product-quality/use-styleguide-colors-only': 'error',

    // Security Rules (v1.10.0+)
    'product-quality/require-input-sanitization': 'error',
    'product-quality/require-csrf-protection': 'error',
    'product-quality/require-critical-path-error-handling': 'error',
    'product-quality/require-rate-limiting': 'error',

    // Project Quality (v1.11.0+)
    'product-quality/require-project-isolation': 'error',

    // Content Quality (v1.12.1+)
    'product-quality/no-ai-obvious-content': 'error',

    // Payment Compliance (v1.13.0+)
    'product-quality/require-card-payment-fairness': 'error',
    'product-quality/require-credential-on-file-agreement': 'error',
    'product-quality/require-aml-kyc-policy': 'error',
    'product-quality/require-currency-multi-support': 'error',
    'product-quality/require-blog-content-attribution': 'error',
    'product-quality/require-roadmap-dating': 'error',
    'product-quality/no-fake-testimonials-pre-launch': 'error',
    'product-quality/require-expert-anonymization': 'error',
    'product-quality/require-payment-logos-on-page': 'error',

    // Modern UX Best Practices (v1.14.0)
    'product-quality/require-hero-section': 'error',
    'product-quality/require-single-cta-focus': 'error',
    'product-quality/require-social-proof-section': 'error',
    'product-quality/require-value-proposition': 'error',
    'product-quality/require-trust-signals': 'error',
    'product-quality/no-wall-of-text': 'error',

    // UX Polish Rules (v1.15.0)
    'product-quality/require-pricing-comparison': 'error',
    'product-quality/require-faq-section': 'error',
    'product-quality/require-demo-or-trial-cta': 'error',

    // Accessibility Rules (v1.18.0)
    'product-quality/require-heading-hierarchy': 'error',
    'product-quality/no-autofocus': 'error',
    'product-quality/require-lang-attribute': 'error',
    'product-quality/require-skip-link': 'error',

    // Advanced Security Rules (v1.19.0)
    'product-quality/no-eval': 'error',
    'product-quality/no-unsafe-regex': 'error',
    'product-quality/no-child-process-exec': 'error',
    'product-quality/no-object-injection': 'error',

    // ARIA Validation Rules (v1.20.0)
    'product-quality/require-valid-aria-props': 'error',
    'product-quality/no-positive-tabindex': 'error',
    'product-quality/no-redundant-roles': 'error',

    // Tailwind CSS Rules (v1.21.0)
    'product-quality/no-contradicting-tailwind-classes': 'error',
    'product-quality/require-tailwind-responsive-order': 'error',

    // Auth Component Consistency Rules (v1.22.0)
    'product-quality/require-logout-in-authenticated-layouts': 'error',
    'product-quality/require-logo-component-in-layouts': 'error',

    // Auth Middleware Protection (v1.23.0)
    'product-quality/require-auth-middleware': 'error',

    // Auth Security Rules (v1.24.0)
    'product-quality/no-hardcoded-user-id': 'error',
    'product-quality/require-session-provider': 'error',

    // Next.js & UX Rules (v1.25.0)
    'product-quality/require-suspense-for-search-params': 'error',
    'product-quality/no-alert-calls': 'error',

    // Extended A11y Rules (v1.27.0)
    'product-quality/anchor-has-content': 'error',
    'product-quality/anchor-is-valid': 'error',
    'product-quality/click-events-have-key-events': 'error',
    'product-quality/img-redundant-alt': 'error',
    'product-quality/mouse-events-have-key-events': 'error',

    // Payment Compliance Rules (v1.28.0)
    'product-quality/no-free-credits-mentions': 'error',
    'product-quality/no-subscription-language': 'error',
    'product-quality/no-unverified-statistics': 'error',
    'product-quality/no-digital-wallet-mentions': 'error',
  },
};
