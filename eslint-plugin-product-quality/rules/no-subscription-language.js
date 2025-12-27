/**
 * @fileoverview Disallow subscription-based language for credit-based pricing models
 * @description For pay-as-you-go credit systems, remove subscription terminology:
 * - "/month" or "/mo" in pricing
 * - "monthly", "annually", "yearly"
 * - "subscription", "subscribe"
 * - "billing cycle", "recurring"
 */

'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow subscription language in credit-based pricing models',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      perMonth: 'Remove "/month" or "/mo" from pricing - use credit bundles instead',
      monthlyAnnual: 'Remove "{{term}}" - credit-based models don\'t have billing cycles',
      subscription: 'Remove subscription language - use "credit bundle" or "pay-as-you-go" instead',
      billingCycle: 'Remove billing cycle reference - credits don\'t expire or renew',
      recurring: 'Remove recurring payment language - credits are one-time purchases',
    },
    schema: [],
  },

  create(context) {
    // File path check - only check pricing-related files
    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Patterns to detect
    const perMonthPattern = /\/\s*(month|mo|yr|year)\b/i;
    const monthlyAnnualPattern = /\b(monthly|annually|yearly|per\s+month|per\s+year|billed\s+(monthly|annually|yearly))\b/i;
    // Only flag subscription in payment/pricing context, not newsletter
    const subscriptionPattern = /\b(subscription\s+(plan|service|fee|payment|price|cost)|subscribe\s+to\s+(our\s+)?(service|plan|premium)|paid\s+subscription)\b/i;
    const billingCyclePattern = /\b(billing\s+cycle|billing\s+period|next\s+billing|renewal\s+date)\b/i;
    const recurringPattern = /\b(recurring\s+(payment|charge|billing)|auto[\s-]?renew)\b/i;

    // Allowed contexts (e.g., cancellation policy explaining old model)
    const allowedContextPattern = /\b(cancel|refund|policy|terms)\b/i;

    function checkText(node, text) {
      if (!text || typeof text !== 'string') return;

      // Skip if in allowed context (policy pages explaining terms)
      if (allowedContextPattern.test(filename)) {
        // Still check for /month in pricing but be lenient on policy pages
        if (!perMonthPattern.test(text)) return;
      }

      if (perMonthPattern.test(text)) {
        context.report({
          node,
          messageId: 'perMonth',
        });
        return;
      }

      const monthlyMatch = text.match(monthlyAnnualPattern);
      if (monthlyMatch) {
        context.report({
          node,
          messageId: 'monthlyAnnual',
          data: { term: monthlyMatch[1] },
        });
        return;
      }

      if (subscriptionPattern.test(text)) {
        context.report({
          node,
          messageId: 'subscription',
        });
        return;
      }

      if (billingCyclePattern.test(text)) {
        context.report({
          node,
          messageId: 'billingCycle',
        });
        return;
      }

      if (recurringPattern.test(text)) {
        context.report({
          node,
          messageId: 'recurring',
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
