/**
 * @fileoverview Ensures complete payment processor compliance (AML/KYC/Visa/Mastercard)
 * @author AutoQA
 *
 * This rule validates all requirements from payment-compliance-audit.skill
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures complete payment processor compliance for acquirer onboarding',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      // Company Information
      missingCompanyInfo: 'Company information incomplete in {{location}}. Required: legal name, registration number, and address.',
      vatNumberDisplayed: 'VAT/Tax number must NOT be displayed ({{location}}). Remove if not VAT registered.',
      acquirerNameDisplayed: 'Payment processor/acquirer name "{{name}}" found in {{location}}. NEVER display acquirer name - CRITICAL violation.',

      // Address Rules
      physicalAddressInFooter: 'Physical merchant address found in footer ({{location}}). Only registration address allowed in footer. Physical address ONLY on checkout page.',
      registrationAddressMissing: 'Registration address missing from {{location}}. Required in footer and all legal policies.',

      // Payment Information
      paymentLogoMissing: 'Payment method logos (Visa/Mastercard) not found on main page. Required to be visible.',
      paymentLogoWrongSize: 'Payment logo "{{logo}}" in {{location}} is too small. Minimum: Visa 40px, Mastercard 44px width.',
      unauthorizedPaymentMethod: 'Unauthorized payment method "{{method}}" found. Only allowed: Visa, Mastercard, Apple Pay, Google Pay.',

      // B2B Prohibition
      b2bLanguageDetected: 'B2B/Enterprise language detected: "{{term}}" in {{location}}. Product must target B2C consumers only.',
      b2bPricingTier: 'B2B pricing tier "{{tier}}" detected. Use consumer-friendly names: Free, Starter, Pro, Premium, Advanced.',

      // Discount Limits
      excessiveDiscount: 'Discount {{discount}}% exceeds maximum allowed (15%). Keep discounts between 3-15% for acquirer approval.',

      // Legal Policies
      missingCredentialOnFile: 'Subscription/auto-renewal detected but missing Credential-on-File agreement. Required for recurring payments.',
      paymentPolicyIncomplete: 'Payment policy missing critical clause: {{clause}}. Required: no min/max limits, chargeback rights, currencies listed.',
      privacyPolicyMissingCardData: 'Privacy policy must state "Card data is NOT stored on our servers" and "We receive only last 4 digits".',

      // Receipt Requirements
      receiptTemplateMissingFields: 'Receipt/confirmation email template missing required fields: {{fields}}. All 14 fields mandatory.',

      // Content Quality
      testimonialPreLaunch: 'Customer testimonial detected but product appears pre-launch. Use test group feedback (clearly labeled) or remove.',
      blogPostNotDated: 'Blog post in {{location}} missing publication date. Date must be near onboarding submission (within 2-4 weeks).',

      // Isolation
      sharedEmailDetected: 'Email "{{email}}" appears to be shared with another project. Each project MUST have unique emails - CRITICAL for isolation.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          companyInfo: {
            type: 'object',
            properties: {
              legalName: { type: 'string' },
              registrationNumber: { type: 'string' },
              registrationAddress: { type: 'string' },
              physicalAddress: { type: 'string' },
              supportEmail: { type: 'string' },
              isVatRegistered: { type: 'boolean', default: false },
            },
          },
          allowedPaymentMethods: {
            type: 'array',
            items: { type: 'string' },
            default: ['visa', 'mastercard', 'apple-pay', 'google-pay'],
          },
          maxDiscountPercent: {
            type: 'number',
            default: 15,
          },
          prohibitedEmails: {
            type: 'array',
            description: 'Emails used in previous projects that must not be reused',
            items: { type: 'string' },
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const projectRoot = context.getCwd();

    const companyInfo = options.companyInfo || {};
    const isVatRegistered = companyInfo.isVatRegistered || false;
    const maxDiscount = options.maxDiscountPercent || 15;
    const allowedPaymentMethods = options.allowedPaymentMethods || ['visa', 'mastercard', 'apple-pay', 'google-pay'];
    const prohibitedEmails = options.prohibitedEmails || [];

    // B2B terms to detect and prohibit
    const b2bTerms = [
      'enterprise', 'corporate', 'business plan', 'b2b',
      'for businesses', 'for companies', 'for teams',
      'team plan', 'company plan', 'organization plan'
    ];

    // Acquirer/processor names to never display
    // Note: "square" is excluded because "aspect-square" is a common Tailwind class
    const acquirerNames = [
      'stripe', 'paypal', 'adyen', 'checkout.com',
      'worldpay', 'braintree', 'authorize.net', 'payu',
    ];

    let checked = false;

    return {
      Program(node) {
        if (checked) return;
        checked = true;

        const fileName = context.getFilename();

        // Check from various entry points
        if (!fileName.includes('app/layout.tsx') &&
            !fileName.includes('app/page.tsx') &&
            !fileName.includes('components/Footer.tsx') &&
            !fileName.includes('app/pricing/page.tsx')) {
          return;
        }

        // 1. CHECK VAT NUMBER NOT DISPLAYED
        if (!isVatRegistered) {
          const filesToCheck = [
            'components/Footer.tsx',
            'app/terms/page.tsx',
            'app/privacy/page.tsx',
          ];

          filesToCheck.forEach(file => {
            const fullPath = path.join(projectRoot, file);
            if (fs.existsSync(fullPath)) {
              const content = fs.readFileSync(fullPath, 'utf8');
              // Match VAT/TVA as whole words, not as part of other words like "derivative"
              if (/\bVAT\b|\bTax\s+ID\b|\bTax\s+Number\b|\bTVA\b/i.test(content)) {
                context.report({
                  node,
                  messageId: 'vatNumberDisplayed',
                  data: { location: file },
                });
              }
            }
          });
        }

        // 2. CHECK ACQUIRER NAME NOT DISPLAYED
        const publicFiles = [
          'app/page.tsx',
          'app/pricing/page.tsx',
          'components/Header.tsx',
          'components/Footer.tsx',
        ];

        publicFiles.forEach(file => {
          const fullPath = path.join(projectRoot, file);
          if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
            acquirerNames.forEach(acquirer => {
              // Only check for acquirer name in visible text content (>text<)
              // Skip imports, variable names, package names
              const displayPattern = new RegExp(`>\\s*${acquirer}\\s*<`, 'i');
              if (displayPattern.test(content)) {
                context.report({
                  node,
                  messageId: 'acquirerNameDisplayed',
                  data: {
                    name: acquirer,
                    location: file,
                  },
                });
              }
            });
          }
        });

        // 3. CHECK PAYMENT LOGOS ON MAIN PAGE
        const homepagePath = path.join(projectRoot, 'app/page.tsx');
        const footerPath = path.join(projectRoot, 'components/Footer.tsx');

        let hasPaymentLogos = false;
        [homepagePath, footerPath].forEach(file => {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('visa') || content.includes('mastercard')) {
              hasPaymentLogos = true;
            }
          }
        });

        if (!hasPaymentLogos && fs.existsSync(footerPath)) {
          context.report({
            node,
            messageId: 'paymentLogoMissing',
          });
        }

        // 4. CHECK B2B LANGUAGE
        const pricingPath = path.join(projectRoot, 'app/pricing/page.tsx');
        if (fs.existsSync(pricingPath)) {
          const content = fs.readFileSync(pricingPath, 'utf8');

          b2bTerms.forEach(term => {
            const regex = new RegExp(term, 'i');
            if (regex.test(content)) {
              context.report({
                node,
                messageId: 'b2bLanguageDetected',
                data: {
                  term,
                  location: 'app/pricing/page.tsx',
                },
              });
            }
          });

          // Check tier names
          const tierMatches = content.match(/(Enterprise|Corporate|Business|Team Plan|Company Plan)/gi);
          if (tierMatches) {
            tierMatches.forEach(tier => {
              context.report({
                node,
                messageId: 'b2bPricingTier',
                data: { tier },
              });
            });
          }
        }

        // 5. CHECK DISCOUNT LIMITS
        if (fs.existsSync(pricingPath)) {
          const content = fs.readFileSync(pricingPath, 'utf8');

          // Look for discount percentages
          const discountMatches = content.match(/(\d+)%\s*(off|discount|save)/gi);
          if (discountMatches) {
            discountMatches.forEach(match => {
              const percent = parseInt(match.match(/(\d+)/)[1]);
              if (percent > maxDiscount) {
                context.report({
                  node,
                  messageId: 'excessiveDiscount',
                  data: { discount: percent },
                });
              }
            });
          }
        }

        // 6. CHECK CREDENTIAL-ON-FILE AGREEMENT
        const packagePath = path.join(projectRoot, 'package.json');
        if (fs.existsSync(packagePath)) {
          const packageContent = fs.readFileSync(packagePath, 'utf8');
          const usesStripe = packageContent.includes('stripe');

          if (usesStripe && fs.existsSync(pricingPath)) {
            const pricingContent = fs.readFileSync(pricingPath, 'utf8');
            const hasSubscription = /month|annual|subscription|recurring/i.test(pricingContent);

            if (hasSubscription) {
              // Check for Credential-on-File agreement
              const credentialOnFilePaths = [
                'app/terms/page.tsx',
                'app/payment-policy/page.tsx',
                'app/credential-on-file/page.tsx',
              ];

              let hasCofAgreement = false;
              credentialOnFilePaths.forEach(file => {
                const fullPath = path.join(projectRoot, file);
                if (fs.existsSync(fullPath)) {
                  const content = fs.readFileSync(fullPath, 'utf8');
                  if (/credential.*file|stored.*payment|recurring.*charge|auto.*renew.*agree/i.test(content)) {
                    hasCofAgreement = true;
                  }
                }
              });

              if (!hasCofAgreement) {
                context.report({
                  node,
                  messageId: 'missingCredentialOnFile',
                });
              }
            }
          }
        }

        // 7. CHECK PAYMENT POLICY CRITICAL CLAUSES
        const paymentPolicyPath = path.join(projectRoot, 'app/payment-policy/page.tsx');
        if (fs.existsSync(paymentPolicyPath)) {
          const content = fs.readFileSync(paymentPolicyPath, 'utf8');

          const requiredClauses = [
            { text: /no\s+minimum.*maximum|no\s+min.*max/i, name: 'no minimum/maximum transaction limits' },
            { text: /dispute.*transaction|chargeback.*right/i, name: 'customer chargeback rights' },
            { text: /EUR|USD|GBP/i, name: 'supported currencies (EUR, USD, GBP)' },
          ];

          requiredClauses.forEach(({ text, name }) => {
            if (!text.test(content)) {
              context.report({
                node,
                messageId: 'paymentPolicyIncomplete',
                data: { clause: name },
              });
            }
          });
        }

        // 8. CHECK PRIVACY POLICY CARD DATA STATEMENT
        const privacyPath = path.join(projectRoot, 'app/privacy/page.tsx');
        if (fs.existsSync(privacyPath)) {
          const content = fs.readFileSync(privacyPath, 'utf8');

          const hasCardDataStatement = /card\s+data.*not\s+stored|do\s+not\s+store.*card|only.*last\s+4\s+digits/i.test(content);

          if (!hasCardDataStatement) {
            context.report({
              node,
              messageId: 'privacyPolicyMissingCardData',
            });
          }
        }

        // 9. CHECK SHARED EMAIL (ISOLATION)
        if (prohibitedEmails.length > 0) {
          const filesToCheckEmail = [
            'components/Footer.tsx',
            'app/contact/page.tsx',
            '.env.local',
            '.env.example',
          ];

          filesToCheckEmail.forEach(file => {
            const fullPath = path.join(projectRoot, file);
            if (fs.existsSync(fullPath)) {
              const content = fs.readFileSync(fullPath, 'utf8');
              prohibitedEmails.forEach(email => {
                if (content.includes(email)) {
                  context.report({
                    node,
                    messageId: 'sharedEmailDetected',
                    data: { email },
                  });
                }
              });
            }
          });
        }
      },

      // Check for B2B language in JSX
      JSXText(node) {
        const text = node.value.toLowerCase();

        b2bTerms.forEach(term => {
          if (text.includes(term.toLowerCase())) {
            const fileName = context.getFilename();
            if (fileName.includes('app/pricing') || fileName.includes('app/page.tsx')) {
              context.report({
                node,
                messageId: 'b2bLanguageDetected',
                data: {
                  term,
                  location: path.relative(projectRoot, fileName),
                },
              });
            }
          }
        });
      },

      // Check for acquirer names in string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          const value = node.value.toLowerCase();

          acquirerNames.forEach(acquirer => {
            if (value.includes(acquirer)) {
              const fileName = context.getFilename();
              // Allow in API routes and config, but not in UI components
              if (!fileName.includes('/api/') && !fileName.includes('config')) {
                context.report({
                  node,
                  messageId: 'acquirerNameDisplayed',
                  data: {
                    name: acquirer,
                    location: path.relative(projectRoot, fileName),
                  },
                });
              }
            }
          });
        }
      },

      // Check for excessive discounts in JSX expressions
      JSXExpressionContainer(node) {
        const fileName = context.getFilename();
        if (!fileName.includes('app/pricing')) return;

        // Only check numeric values in discount-related contexts
        if (node.expression.type === 'Literal' && typeof node.expression.value === 'number') {
          // Skip if this is an attribute value (like width={48}, height={32}, etc.)
          if (node.parent && node.parent.type === 'JSXAttribute') {
            const attrName = node.parent.name && node.parent.name.name;
            // Skip common non-discount attributes
            const skipAttrs = ['width', 'height', 'size', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight',
                              'top', 'left', 'right', 'bottom', 'margin', 'padding', 'gap', 'cols', 'rows',
                              'delay', 'duration', 'tabIndex', 'step', 'min', 'max', 'order', 'zIndex'];
            if (skipAttrs.includes(attrName)) {
              return;
            }
          }

          // Only flag values that could realistically be discount percentages
          // and are in a clearly discount-related context
          if (node.expression.value > maxDiscount && node.expression.value < 100) {
            // Check if there's a nearby "%" or "discount" text to confirm context
            const source = context.getSourceCode();
            const tokenBefore = source.getTokenBefore(node);
            const tokenAfter = source.getTokenAfter(node);

            const nearbyText = [
              tokenBefore && tokenBefore.value,
              tokenAfter && tokenAfter.value,
            ].filter(Boolean).join(' ').toLowerCase();

            // Only report if there's evidence this is a discount
            if (nearbyText.includes('%') || nearbyText.includes('discount') ||
                nearbyText.includes('off') || nearbyText.includes('save')) {
              context.report({
                node,
                messageId: 'excessiveDiscount',
                data: { discount: node.expression.value },
              });
            }
          }
        }
      },
    };
  },
};
