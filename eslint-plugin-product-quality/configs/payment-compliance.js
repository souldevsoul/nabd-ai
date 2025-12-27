/**
 * Payment Compliance configuration for AutoQA ESLint Plugin
 *
 * Rules specifically for Visa/Mastercard/AML payment processor compliance.
 * Use this config when preparing for acquirer onboarding.
 *
 * @version 1.28.0
 */

module.exports = {
  plugins: ['product-quality'],
  rules: {
    // ========================================
    // CRITICAL - Blocks acquirer approval
    // ========================================

    // B2B Prohibition
    'product-quality/no-b2b-language': 'error',

    // VAT/Tax Display
    'product-quality/no-vat-number-display': 'error',

    // Acquirer Name (NEVER display)
    'product-quality/no-acquirer-name-display': 'error',

    // Discount Limits (3-15%)
    'product-quality/require-discount-limits': 'error',

    // ========================================
    // IMPORTANT - Required for compliance
    // ========================================

    // Payment Logo Display
    'product-quality/require-payment-logo-compliance': 'error',
    'product-quality/consistent-payment-providers': 'error',

    // Company Information
    'product-quality/consistent-company-info': 'error',
    'product-quality/require-support-contact-complete': 'error',

    // Address Requirements
    'product-quality/require-physical-address-checkout': 'error',

    // Currency Display
    'product-quality/require-currency-format': 'error',

    // ========================================
    // LEGAL PAGES - All 7 required
    // ========================================

    'product-quality/require-legal-pages-exist': 'error',
    'product-quality/require-legal-pages-plain-format': 'error',
    'product-quality/require-consistent-legal-page-design': 'error',

    // ========================================
    // CONTENT QUALITY
    // ========================================

    // Testimonials
    'product-quality/require-testimonial-disclaimer': 'error',

    // No Fake Content
    'product-quality/no-fake-content': 'error',

    // ========================================
    // RECEIPT/CONFIRMATION
    // ========================================

    'product-quality/require-receipt-template-fields': 'error',

    // ========================================
    // PAYMENT SYSTEM
    // ========================================

    'product-quality/require-payment-compliance': 'error',
    'product-quality/require-invoice-management': 'warn',
    'product-quality/require-credit-system': 'warn',

    // ========================================
    // NEW PAYMENT COMPLIANCE RULES (v1.28.0)
    // ========================================

    // Credit-based pricing (no subscription language)
    'product-quality/no-free-credits-mentions': 'error',
    'product-quality/no-subscription-language': 'error',

    // B2C compliance (hide payment processors from UI)
    'product-quality/no-digital-wallet-mentions': 'error',

    // Legal compliance (verified statistics only)
    'product-quality/no-unverified-statistics': 'error',
  },
};
