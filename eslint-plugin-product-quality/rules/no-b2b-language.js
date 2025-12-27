/**
 * Rule: no-b2b-language
 * Prohibits B2B tier names and language for payment processor compliance
 *
 * Payment processors require B2C-only products. B2B language raises red flags.
 *
 * Prohibited terms:
 * - Tier names: "Business", "Corporate", "Enterprise", "Team", "Company"
 * - Language: "For teams", "For businesses", "B2B", "corporate solutions"
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibit B2B tier names and language for payment compliance',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      b2bTierName: 'B2B tier name "{{name}}" is prohibited. Use: Free, Starter, Pro, Premium, Advanced instead.',
      b2bLanguage: 'B2B language "{{text}}" is prohibited. Target B2C consumers only.',
    },
    schema: [],
  },

  create(context) {
    // Prohibited tier names (case insensitive) - only when clearly used as pricing tier names
    const prohibitedTierNames = [
      'business',
      'corporate',
      // Note: 'enterprise' removed - commonly used in "enterprise-grade", "enterprise security" etc.
      // Note: 'team', 'company', 'organization' removed - common in non-B2B contexts
      // These are handled more specifically in prohibitedPhrases instead
    ];

    // Prohibited B2B phrases - strict B2B marketing language only
    const prohibitedPhrases = [
      'for businesses',
      'for enterprises',
      'b2b',
      'corporate solution',
      'corporate solutions',
      'business solution',
      'business solutions',
      'enterprise plan',
      'enterprise plans',
      'business plan',
      'per seat',
      'bulk pricing',
      // Note: 'for teams', 'team plan', 'employees', 'volume discount' removed
      // - 'for teams' and 'team plan' are common in consumer products
      // - 'employees' appears in legal/privacy contexts
      // - 'volume discount' can apply to consumer bulk purchases
    ];

    // Check if file is pricing-related
    function isPricingFile(filename) {
      const pricingPatterns = [
        /pricing/i,
        /plans?/i,
        /subscription/i,
        /tier/i,
        /package/i,
        /billing/i,
      ];
      return pricingPatterns.some(p => p.test(filename));
    }

    // Check string literals
    function checkStringLiteral(node, value) {
      if (!value || typeof value !== 'string') return;

      const lowerValue = value.toLowerCase();

      // Check for prohibited tier names (exact match or as part of tier name)
      for (const tierName of prohibitedTierNames) {
        // Match tier names like "Business Plan", "Enterprise", "Team Plan"
        const tierPattern = new RegExp(`\\b${tierName}\\b`, 'i');
        if (tierPattern.test(value)) {
          // Skip if it's a generic usage (not a tier name context)
          // Check if it's likely a pricing tier
          const tierContext = /plan|tier|package|subscription|pricing/i.test(value) ||
                             isPricingFile(context.getFilename());

          if (tierContext || prohibitedTierNames.includes(lowerValue)) {
            context.report({
              node,
              messageId: 'b2bTierName',
              data: { name: value },
            });
            return;
          }
        }
      }

      // Check for prohibited phrases
      for (const phrase of prohibitedPhrases) {
        if (lowerValue.includes(phrase)) {
          context.report({
            node,
            messageId: 'b2bLanguage',
            data: { text: phrase },
          });
          return;
        }
      }
    }

    return {
      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkStringLiteral(node, node.value);
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          checkStringLiteral(quasi, quasi.value.raw);
        });
      },

      // Check JSX text
      JSXText(node) {
        checkStringLiteral(node, node.value);
      },

      // Check object properties (for tier definitions)
      Property(node) {
        // Check if key is a tier name
        if (node.key && node.key.type === 'Identifier') {
          const keyName = node.key.name.toLowerCase();
          if (prohibitedTierNames.includes(keyName)) {
            context.report({
              node: node.key,
              messageId: 'b2bTierName',
              data: { name: node.key.name },
            });
          }
        }

        // Check if value is a tier name string
        if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
          const valueLower = node.value.value.toLowerCase();
          if (prohibitedTierNames.includes(valueLower)) {
            context.report({
              node: node.value,
              messageId: 'b2bTierName',
              data: { name: node.value.value },
            });
          }
        }
      },
    };
  },
};
