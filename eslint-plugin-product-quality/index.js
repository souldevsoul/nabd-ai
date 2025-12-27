/**
 * ESLint Plugin: Product Quality
 * 99 rules for production-ready SaaS products
 *
 * @version 1.29.0
 * @date 2025-11-27
 * @updated v1.29.0: Removed 31 optional/stylistic rules, kept 99 active rules
 */

// Import all rules from separate files
const requireConsistentLayout = require('./rules/require-consistent-layout');
const requireAuthAwareHeader = require('./rules/require-auth-aware-header');
const requireCreditSystem = require('./rules/require-credit-system');
const requireCookieConsent = require('./rules/require-cookie-consent');
const requireFunctionalAuthSystem = require('./rules/require-functional-auth-system');
const requireEnvironmentVariables = require('./rules/require-environment-variables');
const noConsole = require('./rules/no-console');
const requireConsistentLogo = require('./rules/require-consistent-logo');
const requireTextColorContrast = require('./rules/require-text-color-contrast');
const useStyleguideColorsOnly = require('./rules/use-styleguide-colors-only');
const noBrutalistDesign = require('./rules/no-brutalist-design');
const noFakeContent = require('./rules/no-fake-content');

// Base rules
const noBrokenInternalLinks = require('./rules/no-broken-internal-links');
const consistentCompanyInfo = require('./rules/consistent-company-info');
const consistentPaymentProviders = require('./rules/consistent-payment-providers');
const noButtonWithoutHandler = require('./rules/no-button-without-handler');
const noFormWithoutSubmit = require('./rules/no-form-without-submit');
const noMissingAltText = require('./rules/no-missing-alt-text');
const noGenericPlaceholders = require('./rules/no-generic-placeholders');
const requireLoadingStateOnAsyncButton = require('./rules/require-loading-state-on-async-button');
const requireTryCatchFetch = require('./rules/require-try-catch-fetch');
const requireEmptyState = require('./rules/require-empty-state');
const requireImageOptimization = require('./rules/require-image-optimization');
const requireAriaLabelOnIconButtons = require('./rules/require-aria-label-on-icon-buttons');
const noSocialMediaLinks = require('./rules/no-social-media-links');
const emailMustMatchDomain = require('./rules/email-must-match-domain');

// LogoSmith quality rules
const requireLegalPagesPlainFormat = require('./rules/require-legal-pages-plain-format');
const requireLogoLinksHome = require('./rules/require-logo-links-home');
const requireNavigationInHeader = require('./rules/require-navigation-in-header');
const requirePaymentLogoCompliance = require('./rules/require-payment-logo-compliance');

// Modern SaaS Best Practices
const requireSeoMetadata = require('./rules/require-seo-metadata');
const requireMobileResponsive = require('./rules/require-mobile-responsive');
const requireModernSaasPatterns = require('./rules/require-modern-saas-patterns');
const requireSecurityHeaders = require('./rules/require-security-headers');

// Critical Priority Rules
const requireUniquePageTitles = require('./rules/require-unique-page-titles');
const requireResponsiveImages = require('./rules/require-responsive-images');
const noHardcodedApiUrls = require('./rules/no-hardcoded-api-urls');

// Testing Rules
const requireSufficientContrast = require('./rules/require-sufficient-contrast');
const noBlogPages = require('./rules/no-blog-pages');

// Advanced Quality Rules
const requireLoadingStates = require('./rules/require-loading-states');
const requireErrorBoundaries = require('./rules/require-error-boundaries');
const noConsoleLogsProduction = require('./rules/no-console-logs-production');
const requireAccessibleForms = require('./rules/require-accessible-forms');

// Legal Pages Validation
const requireLegalPagesExist = require('./rules/require-legal-pages-exist');

// BRAND Import Validation
const requireBrandImport = require('./rules/require-brand-import');

// Legal Page Design Consistency
const requireConsistentLegalPageDesign = require('./rules/require-consistent-legal-page-design');

// Tailwind Configuration Consistency
const requireTailwindConfigConsistency = require('./rules/require-tailwind-config-consistency');

// Complete Product Flow
const requireCompleteUserFlow = require('./rules/require-complete-user-flow');
const requireCompleteApiRoutes = require('./rules/require-complete-api-routes');
const requireDashboardSettingsComplete = require('./rules/require-dashboard-settings-complete');
const requireAdminPanel = require('./rules/require-admin-panel');
const requireInvoiceManagement = require('./rules/require-invoice-management');
const requirePaymentCompliance = require('./rules/require-payment-compliance');

// High-Priority Cross-Project Rules
const enforceColorContrast = require('./rules/enforce-color-contrast');
const noExternalLinksWithoutTarget = require('./rules/no-external-links-without-target');

// UI Rules
const noEmojisInUi = require('./rules/no-emojis-in-ui');
const requireConsistentIconLibrary = require('./rules/require-consistent-icon-library');

// Payment Processor Compliance
const noB2bLanguage = require('./rules/no-b2b-language');
const requireDiscountLimits = require('./rules/require-discount-limits');
const noVatNumberDisplay = require('./rules/no-vat-number-display');
const requirePhysicalAddressCheckout = require('./rules/require-physical-address-checkout');
const noAcquirerNameDisplay = require('./rules/no-acquirer-name-display');
const requireTestimonialDisclaimer = require('./rules/require-testimonial-disclaimer');
const requireReceiptTemplateFields = require('./rules/require-receipt-template-fields');

// Payment Logo on Page
const requirePaymentLogosOnPage = require('./rules/require-payment-logos-on-page');

// Security Rules
const requireInputSanitization = require('./rules/require-input-sanitization');

// Project Quality Rules
const requireProjectIsolation = require('./rules/require-project-isolation');

// AI Content Detection
const noAiObviousContent = require('./rules/no-ai-obvious-content');

// Payment Compliance
const requireCardPaymentFairness = require('./rules/require-card-payment-fairness');
const requireAmlKycPolicy = require('./rules/require-aml-kyc-policy');

// Content Quality
const requireBlogContentAttribution = require('./rules/require-blog-content-attribution');
const requireRoadmapDating = require('./rules/require-roadmap-dating');
const noFakeTestimonialsPreLaunch = require('./rules/no-fake-testimonials-pre-launch');
const requireExpertAnonymization = require('./rules/require-expert-anonymization');

// Modern UX Best Practices
const requireHeroSection = require('./rules/require-hero-section');
const requireSingleCtaFocus = require('./rules/require-single-cta-focus');
const requireValueProposition = require('./rules/require-value-proposition');
const noWallOfText = require('./rules/no-wall-of-text');

// Accessibility Rules
const noAutofocus = require('./rules/no-autofocus');
const requireLangAttribute = require('./rules/require-lang-attribute');

// Advanced Security Rules
const noEval = require('./rules/no-eval');
const noUnsafeRegex = require('./rules/no-unsafe-regex');
const noChildProcessExec = require('./rules/no-child-process-exec');

// ARIA Validation Rules
const requireValidAriaProps = require('./rules/require-valid-aria-props');
const noPositiveTabindex = require('./rules/no-positive-tabindex');
const noRedundantRoles = require('./rules/no-redundant-roles');

// Tailwind CSS Rules
const noContradictingTailwindClasses = require('./rules/no-contradicting-tailwind-classes');

// Auth Component Consistency
const requireLogoComponentInLayouts = require('./rules/require-logo-component-in-layouts');

// Security & Project Isolation
const requireAuthMiddleware = require('./rules/require-auth-middleware');

// Auth Security Rules
const noHardcodedUserId = require('./rules/no-hardcoded-user-id');
const requireSessionProvider = require('./rules/require-session-provider');

// Next.js & UX Rules
const noAlertCalls = require('./rules/no-alert-calls');

// Extended A11y Rules
const anchorHasContent = require('./rules/anchor-has-content');
const anchorIsValid = require('./rules/anchor-is-valid');
const imgRedundantAlt = require('./rules/img-redundant-alt');

// Payment Compliance Rules
const noFreeCreditsmentions = require('./rules/no-free-credits-mentions');
const noSubscriptionLanguage = require('./rules/no-subscription-language');
const noUnverifiedStatistics = require('./rules/no-unverified-statistics');
const noDigitalWalletMentions = require('./rules/no-digital-wallet-mentions');

module.exports = {
  rules: {
    // Core Rules
    'no-console': noConsole,
    'require-consistent-logo': requireConsistentLogo,
    'require-text-color-contrast': requireTextColorContrast,
    'use-styleguide-colors-only': useStyleguideColorsOnly,
    'no-brutalist-design': noBrutalistDesign,
    'no-fake-content': noFakeContent,
    'require-consistent-layout': requireConsistentLayout,
    'require-auth-aware-header': requireAuthAwareHeader,
    'require-credit-system': requireCreditSystem,
    'require-cookie-consent': requireCookieConsent,
    'require-functional-auth-system': requireFunctionalAuthSystem,
    'require-environment-variables': requireEnvironmentVariables,

    // Base Rules
    'no-broken-internal-links': noBrokenInternalLinks,
    'consistent-company-info': consistentCompanyInfo,
    'consistent-payment-providers': consistentPaymentProviders,

    // UX Consistency Rules
    'no-button-without-handler': noButtonWithoutHandler,
    'no-form-without-submit': noFormWithoutSubmit,
    'no-missing-alt-text': noMissingAltText,
    'no-generic-placeholders': noGenericPlaceholders,
    'require-loading-state-on-async-button': requireLoadingStateOnAsyncButton,
    'require-try-catch-fetch': requireTryCatchFetch,
    'require-empty-state': requireEmptyState,
    'require-image-optimization': requireImageOptimization,
    'require-aria-label-on-icon-buttons': requireAriaLabelOnIconButtons,

    // Content Restrictions
    'no-social-media-links': noSocialMediaLinks,
    'email-must-match-domain': emailMustMatchDomain,

    // LogoSmith Quality Rules
    'require-legal-pages-plain-format': requireLegalPagesPlainFormat,
    'require-logo-links-home': requireLogoLinksHome,
    'require-navigation-in-header': requireNavigationInHeader,
    'require-payment-logo-compliance': requirePaymentLogoCompliance,

    // Modern SaaS Best Practices
    'require-seo-metadata': requireSeoMetadata,
    'require-mobile-responsive': requireMobileResponsive,
    'require-modern-saas-patterns': requireModernSaasPatterns,
    'require-security-headers': requireSecurityHeaders,

    // Critical Priority Rules
    'require-unique-page-titles': requireUniquePageTitles,
    'require-responsive-images': requireResponsiveImages,
    'no-hardcoded-api-urls': noHardcodedApiUrls,

    // Testing Rules
    'require-sufficient-contrast': requireSufficientContrast,
    'no-blog-pages': noBlogPages,

    // Advanced Quality Rules
    'require-loading-states': requireLoadingStates,
    'require-error-boundaries': requireErrorBoundaries,
    'no-console-logs-production': noConsoleLogsProduction,
    'require-accessible-forms': requireAccessibleForms,

    // Legal Pages Validation
    'require-legal-pages-exist': requireLegalPagesExist,

    // BRAND Import Validation
    'require-brand-import': requireBrandImport,

    // Legal Page Design Consistency
    'require-consistent-legal-page-design': requireConsistentLegalPageDesign,

    // Tailwind Configuration Consistency
    'require-tailwind-config-consistency': requireTailwindConfigConsistency,

    // Complete Product Flow
    'require-complete-user-flow': requireCompleteUserFlow,
    'require-complete-api-routes': requireCompleteApiRoutes,
    'require-dashboard-settings-complete': requireDashboardSettingsComplete,
    'require-admin-panel': requireAdminPanel,
    'require-invoice-management': requireInvoiceManagement,
    'require-payment-compliance': requirePaymentCompliance,

    // High-Priority Cross-Project Rules
    'enforce-color-contrast': enforceColorContrast,
    'no-external-links-without-target': noExternalLinksWithoutTarget,

    // UI Rules
    'no-emojis-in-ui': noEmojisInUi,
    'require-consistent-icon-library': requireConsistentIconLibrary,

    // Payment Processor Compliance
    'no-b2b-language': noB2bLanguage,
    'require-discount-limits': requireDiscountLimits,
    'no-vat-number-display': noVatNumberDisplay,
    'require-physical-address-checkout': requirePhysicalAddressCheckout,
    'no-acquirer-name-display': noAcquirerNameDisplay,
    'require-testimonial-disclaimer': requireTestimonialDisclaimer,
    'require-receipt-template-fields': requireReceiptTemplateFields,

    // Payment Logo on Page
    'require-payment-logos-on-page': requirePaymentLogosOnPage,

    // Security Rules
    'require-input-sanitization': requireInputSanitization,

    // Project Quality Rules
    'require-project-isolation': requireProjectIsolation,

    // AI Content Detection
    'no-ai-obvious-content': noAiObviousContent,

    // Payment Compliance
    'require-card-payment-fairness': requireCardPaymentFairness,
    'require-aml-kyc-policy': requireAmlKycPolicy,

    // Content Quality
    'require-blog-content-attribution': requireBlogContentAttribution,
    'require-roadmap-dating': requireRoadmapDating,
    'no-fake-testimonials-pre-launch': noFakeTestimonialsPreLaunch,
    'require-expert-anonymization': requireExpertAnonymization,

    // Modern UX Best Practices
    'require-hero-section': requireHeroSection,
    'require-single-cta-focus': requireSingleCtaFocus,
    'require-value-proposition': requireValueProposition,
    'no-wall-of-text': noWallOfText,

    // Accessibility Rules
    'no-autofocus': noAutofocus,
    'require-lang-attribute': requireLangAttribute,

    // Advanced Security Rules
    'no-eval': noEval,
    'no-unsafe-regex': noUnsafeRegex,
    'no-child-process-exec': noChildProcessExec,

    // ARIA Validation Rules
    'require-valid-aria-props': requireValidAriaProps,
    'no-positive-tabindex': noPositiveTabindex,
    'no-redundant-roles': noRedundantRoles,

    // Tailwind CSS Rules
    'no-contradicting-tailwind-classes': noContradictingTailwindClasses,

    // Auth Component Consistency
    'require-logo-component-in-layouts': requireLogoComponentInLayouts,

    // Security & Project Isolation
    'require-auth-middleware': requireAuthMiddleware,

    // Auth Security Rules
    'no-hardcoded-user-id': noHardcodedUserId,
    'require-session-provider': requireSessionProvider,

    // Next.js & UX Rules
    'no-alert-calls': noAlertCalls,

    // Extended A11y Rules
    'anchor-has-content': anchorHasContent,
    'anchor-is-valid': anchorIsValid,
    'img-redundant-alt': imgRedundantAlt,

    // Payment Compliance Rules
    'no-free-credits-mentions': noFreeCreditsmentions,
    'no-subscription-language': noSubscriptionLanguage,
    'no-unverified-statistics': noUnverifiedStatistics,
    'no-digital-wallet-mentions': noDigitalWalletMentions,
  },

  // Preset Configurations
  configs: require('./configs'),
};
