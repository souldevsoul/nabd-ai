/**
 * @fileoverview Disallow mentions of free credits, signup bonuses, and welcome credits
 * @description Payment processors question free credit systems. Remove all mentions of:
 * - "free credits"
 * - "signup bonus"
 * - "welcome bonus"
 * - "X free credits"
 * - "bonus credits"
 */

'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow mentions of free credits and signup bonuses',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      freeCredits: 'Remove "free credits" mention - payment processors question free credit systems',
      signupBonus: 'Remove signup/welcome bonus mention - use pay-as-you-go messaging instead',
      bonusCredits: 'Remove bonus credits mention - not compliant with payment processor requirements',
      specificFreeAmount: 'Remove specific free credit amount ({{amount}}) - creates pricing inconsistencies',
    },
    schema: [],
  },

  create(context) {
    // Patterns to detect
    const freeCreditsPattern = /\b(free\s+credits?|credits?\s+free)\b/i;
    const signupBonusPattern = /\b(sign\s*up\s+bonus|signup\s+bonus|welcome\s+bonus|registration\s+bonus)\b/i;
    const bonusCreditsPattern = /\b(bonus\s+credits?|credits?\s+bonus)\b/i;
    const specificFreePattern = /\b(\d+)\s*(free\s+credits?|credits?\s+free)\b/i;
    const welcomeCreditsPattern = /\b(welcome\s+credits?|starter\s+credits?|initial\s+credits?)\b/i;
    const freeTrialCreditsPattern = /\b(trial\s+credits?|free\s+trial)\b/i;

    function checkText(node, text) {
      if (!text || typeof text !== 'string') return;

      const specificMatch = text.match(specificFreePattern);
      if (specificMatch) {
        context.report({
          node,
          messageId: 'specificFreeAmount',
          data: { amount: specificMatch[1] + ' free credits' },
        });
        return;
      }

      if (freeCreditsPattern.test(text)) {
        context.report({
          node,
          messageId: 'freeCredits',
        });
        return;
      }

      if (signupBonusPattern.test(text) || welcomeCreditsPattern.test(text)) {
        context.report({
          node,
          messageId: 'signupBonus',
        });
        return;
      }

      if (bonusCreditsPattern.test(text) || freeTrialCreditsPattern.test(text)) {
        context.report({
          node,
          messageId: 'bonusCredits',
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
