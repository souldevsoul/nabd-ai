/**
 * ESLint Rule: require-expert-anonymization
 *
 * For marketplace platforms (tutors, experts, freelancers):
 * - Expert profiles should use pseudonyms or first names only
 * - No full names exposed before booking/payment
 * - Contact info should be hidden until transaction
 *
 * This protects:
 * - Expert privacy
 * - Platform business model (prevents direct contact)
 * - User safety
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require anonymization of expert/tutor profiles on marketplace platforms',
      category: 'Privacy',
      recommended: false,
    },
    messages: {
      exposedFullName: 'Expert profile shows full name "{{ name }}". Consider using first name only or pseudonym.',
      exposedEmail: 'Expert profile exposes email address. Hide contact info until after booking.',
      exposedPhone: 'Expert profile exposes phone number. Hide contact info until after booking.',
      noAnonymizationStrategy: 'Marketplace expert listing without anonymization. Add first-name-only display or pseudonym system.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          isMarketplace: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';
    const options = context.options[0] || {};

    // Only applies to marketplace platforms (opt-in)
    if (!options.isMarketplace) return {};

    // Check expert/tutor/freelancer related files
    const marketplacePatterns = [
      /expert/i,
      /tutor/i,
      /teacher/i,
      /freelancer/i,
      /provider/i,
      /instructor/i,
      /mentor/i,
      /consultant/i,
      /profile/i,
      /listing/i,
    ];

    const isMarketplaceFile = marketplacePatterns.some(p => p.test(filename));
    if (!isMarketplaceFile) return {};

    let hasExpertProfile = false;
    let hasAnonymization = false;
    const exposedData = [];

    // Expert profile indicators
    const EXPERT_INDICATORS = [
      /expert/i,
      /tutor/i,
      /teacher/i,
      /instructor/i,
      /mentor/i,
      /freelancer/i,
      /provider/i,
      /profile/i,
    ];

    // Anonymization indicators
    const ANONYMIZATION_PATTERNS = [
      /first[\s_-]?name/i,
      /display[\s_-]?name/i,
      /pseudonym/i,
      /alias/i,
      /username/i,
      /initials/i,
      /masked/i,
      /hidden/i,
    ];

    // Full name patterns (potential exposure) - more strict to avoid false positives
    // Requires at least 3 characters per name part, excludes common UI text
    const FULL_NAME_PATTERN = /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?\b/;
    const EXCLUDED_NAME_PATTERNS = [
      /profile/i, /listing/i, /expert/i, /tutor/i, /freelancer/i,
      /dashboard/i, /settings/i, /contact/i, /booking/i, /session/i,
      /display/i, /name/i, /first/i, /last/i, /user/i,
    ];

    // Email pattern
    const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    // Phone pattern
    const PHONE_PATTERN = /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

    /**
     * Check for expert profile indicators
     */
    function checkForExpertProfile(text) {
      if (!text || typeof text !== 'string') return;
      if (EXPERT_INDICATORS.some(p => p.test(text))) {
        hasExpertProfile = true;
      }
    }

    /**
     * Check for anonymization strategy
     */
    function checkForAnonymization(text) {
      if (!text || typeof text !== 'string') return;
      if (ANONYMIZATION_PATTERNS.some(p => p.test(text))) {
        hasAnonymization = true;
      }
    }

    /**
     * Check for exposed data
     */
    function checkForExposedData(node, text) {
      if (!text || typeof text !== 'string') return;

      // Check for full names in expert context
      const fullNameMatch = text.match(FULL_NAME_PATTERN);
      if (fullNameMatch && hasExpertProfile) {
        const matchedName = fullNameMatch[0];
        // Exclude common UI text patterns
        const isExcluded = EXCLUDED_NAME_PATTERNS.some(p => p.test(matchedName));
        if (!isExcluded) {
          exposedData.push({ node, type: 'fullName', value: matchedName });
        }
      }

      // Check for exposed email
      if (EMAIL_PATTERN.test(text)) {
        exposedData.push({ node, type: 'email', value: text.match(EMAIL_PATTERN)[0] });
      }

      // Check for exposed phone
      if (PHONE_PATTERN.test(text)) {
        exposedData.push({ node, type: 'phone', value: text.match(PHONE_PATTERN)[0] });
      }
    }

    /**
     * Check all text
     */
    function checkText(node, text) {
      checkForExpertProfile(text);
      checkForAnonymization(text);
      checkForExposedData(node, text);
    }

    return {
      // Check JSX text
      JSXText(node) {
        checkText(node, node.value);
      },

      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkText(node, node.value);
        }
      },

      // Check identifiers
      Identifier(node) {
        checkForExpertProfile(node.name);
        checkForAnonymization(node.name);
      },

      // Check property keys
      Property(node) {
        if (node.key) {
          const keyName = node.key.name || node.key.value;
          if (keyName) {
            checkForExpertProfile(keyName);
            checkForAnonymization(keyName);
          }
        }
      },

      // Final check
      'Program:exit'(programNode) {
        // Only check if expert profile context detected
        if (!hasExpertProfile) return;

        // Report exposed data
        for (const exposed of exposedData) {
          if (exposed.type === 'fullName') {
            context.report({
              node: exposed.node,
              messageId: 'exposedFullName',
              data: { name: exposed.value },
            });
          } else if (exposed.type === 'email') {
            context.report({
              node: exposed.node,
              messageId: 'exposedEmail',
            });
          } else if (exposed.type === 'phone') {
            context.report({
              node: exposed.node,
              messageId: 'exposedPhone',
            });
          }
        }

        // Report missing anonymization strategy
        if (!hasAnonymization && exposedData.length === 0) {
          context.report({
            node: programNode,
            messageId: 'noAnonymizationStrategy',
          });
        }
      },
    };
  },
};
