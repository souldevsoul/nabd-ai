/**
 * ESLint Rule: require-aml-kyc-policy
 *
 * High-risk merchant categories (MCC) require Anti-Money Laundering (AML)
 * and Know Your Customer (KYC) policies to be displayed on the website.
 *
 * High-risk categories include:
 * - Financial services, crypto, forex
 * - Gambling, gaming
 * - Adult content
 * - Pharmaceuticals
 * - High-value goods
 *
 * @see FATF Recommendations
 * @see PCI-DSS Compliance
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require AML/KYC policy page for high-risk merchant categories',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      missingAmlPolicy: 'High-risk merchant category detected. Add AML (Anti-Money Laundering) policy page or link.',
      missingKycPolicy: 'High-risk merchant category detected. Add KYC (Know Your Customer) verification disclosure.',
      missingComplianceLink: 'Site mentions high-risk services but lacks compliance/policy links. Add /aml-policy or /kyc-policy page.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          highRiskKeywords: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';
    const options = context.options[0] || {};

    // Check main pages and legal pages
    const relevantPatterns = [
      /page\.(tsx?|jsx?)$/i,
      /legal/i,
      /policy/i,
      /terms/i,
      /compliance/i,
      /footer/i,
      /layout/i,
    ];

    const isRelevantFile = relevantPatterns.some(p => p.test(filename));
    if (!isRelevantFile) return {};

    // Default high-risk keywords
    const DEFAULT_HIGH_RISK = [
      'crypto',
      'cryptocurrency',
      'bitcoin',
      'ethereum',
      'forex',
      'trading',
      'gambling',
      'casino',
      'betting',
      'adult',
      'pharmaceutical',
      'cbd',
      'vape',
      'tobacco',
      'firearms',
      'weapons',
      'money transfer',
      'wire transfer',
      'financial services',
      'investment',
      'securities',
    ];

    const highRiskKeywords = [
      ...DEFAULT_HIGH_RISK,
      ...(options.highRiskKeywords || []),
    ];

    let isHighRiskSite = false;
    let hasAmlReference = false;
    let hasKycReference = false;
    let highRiskKeywordFound = '';

    // AML/KYC reference patterns
    const AML_PATTERNS = [
      /\baml\b/i,
      /anti[- ]?money[- ]?launder/i,
      /aml[- ]?policy/i,
      /\/aml/i,
    ];

    const KYC_PATTERNS = [
      /\bkyc\b/i,
      /know[- ]?your[- ]?customer/i,
      /identity[- ]?verif/i,
      /kyc[- ]?policy/i,
      /\/kyc/i,
      /verification[- ]?required/i,
    ];

    /**
     * Check text for high-risk indicators
     */
    function checkForHighRisk(text) {
      if (!text || typeof text !== 'string') return;
      const lowerText = text.toLowerCase();

      for (const keyword of highRiskKeywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          isHighRiskSite = true;
          highRiskKeywordFound = keyword;
          break;
        }
      }
    }

    /**
     * Check text for AML/KYC references
     */
    function checkForCompliance(text) {
      if (!text || typeof text !== 'string') return;

      if (AML_PATTERNS.some(p => p.test(text))) {
        hasAmlReference = true;
      }
      if (KYC_PATTERNS.some(p => p.test(text))) {
        hasKycReference = true;
      }
    }

    /**
     * Check all text
     */
    function checkText(text) {
      checkForHighRisk(text);
      checkForCompliance(text);
    }

    return {
      // Check JSX text
      JSXText(node) {
        checkText(node.value);
      },

      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkText(node.value);
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        const text = node.quasis.map(q => q.value.raw).join('');
        checkText(text);
      },

      // Check href attributes for policy links
      JSXAttribute(node) {
        if (node.name && node.name.name === 'href' && node.value) {
          const href = node.value.value || '';
          checkForCompliance(href);
        }
      },

      // Final check
      'Program:exit'(node) {
        // Only report if high-risk site without compliance
        if (!isHighRiskSite) return;

        if (!hasAmlReference && !hasKycReference) {
          context.report({
            node,
            messageId: 'missingComplianceLink',
          });
        } else if (!hasAmlReference) {
          context.report({
            node,
            messageId: 'missingAmlPolicy',
          });
        } else if (!hasKycReference) {
          context.report({
            node,
            messageId: 'missingKycPolicy',
          });
        }
      },
    };
  },
};
