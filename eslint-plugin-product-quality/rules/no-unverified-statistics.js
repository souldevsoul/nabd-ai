/**
 * @fileoverview Disallow unverified statistics and percentage claims
 * @description Specific percentage claims without sources can cause legal issues:
 * - "99.9% accuracy" without citation
 * - "10x faster" without benchmark source
 * - Specific time savings claims
 * - User satisfaction percentages
 */

'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow unverified statistics and percentage claims',
      category: 'Legal Compliance',
      recommended: true,
    },
    messages: {
      accuracyPercent: 'Remove specific accuracy claim ({{value}}) - requires verified source or benchmark',
      speedMultiplier: 'Remove speed multiplier claim ({{value}}) - requires benchmark documentation',
      timeSavings: 'Remove specific time savings claim - requires user study documentation',
      satisfactionPercent: 'Remove satisfaction percentage ({{value}}) - requires survey methodology documentation',
      genericPercent: 'Verify or remove percentage claim ({{value}}) - specific stats need sources',
    },
    schema: [],
  },

  create(context) {
    // Patterns to detect
    const accuracyPattern = /\b(\d{1,3}(?:\.\d+)?)\s*%\s*(accuracy|accurate|precision|success\s+rate)/i;
    const speedMultiplierPattern = /\b(\d+(?:\.\d+)?)\s*x\s*(faster|quicker|speed|performance)/i;
    const timeSavingsPattern = /\b(save[sd]?\s+(?:\d+\s+)?(?:hours?|minutes?|days?|weeks?)|(\d+)\s*%\s*(?:less\s+)?time)/i;
    const satisfactionPattern = /\b(\d{1,3}(?:\.\d+)?)\s*%\s*(satisfaction|satisfied|happy|recommend)/i;
    const improvementPattern = /\b(\d{1,3}(?:\.\d+)?)\s*%\s*(improvement|increase|boost|reduction|decrease)/i;

    // Allowed contexts (with citations or sources)
    const sourcePattern = /\b(according\s+to|source:|study|survey|benchmark|based\s+on|research)/i;

    function checkText(node, text) {
      if (!text || typeof text !== 'string') return;

      // Skip if text contains source attribution
      if (sourcePattern.test(text)) return;

      const accuracyMatch = text.match(accuracyPattern);
      if (accuracyMatch) {
        context.report({
          node,
          messageId: 'accuracyPercent',
          data: { value: accuracyMatch[1] + '%' },
        });
        return;
      }

      const speedMatch = text.match(speedMultiplierPattern);
      if (speedMatch) {
        context.report({
          node,
          messageId: 'speedMultiplier',
          data: { value: speedMatch[1] + 'x' },
        });
        return;
      }

      if (timeSavingsPattern.test(text)) {
        context.report({
          node,
          messageId: 'timeSavings',
        });
        return;
      }

      const satisfactionMatch = text.match(satisfactionPattern);
      if (satisfactionMatch) {
        context.report({
          node,
          messageId: 'satisfactionPercent',
          data: { value: satisfactionMatch[1] + '%' },
        });
        return;
      }

      const improvementMatch = text.match(improvementPattern);
      if (improvementMatch) {
        context.report({
          node,
          messageId: 'genericPercent',
          data: { value: improvementMatch[1] + '%' },
        });
      }
    }

    return {
      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkText(node, node.value);
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        node.quasis.forEach((quasi) => {
          checkText(node, quasi.value.raw);
        });
      },

      // Check JSX text
      JSXText(node) {
        checkText(node, node.value);
      },

      // Check JSX attribute values
      JSXAttribute(node) {
        if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
          checkText(node.value, node.value.value);
        }
      },
    };
  },
};
