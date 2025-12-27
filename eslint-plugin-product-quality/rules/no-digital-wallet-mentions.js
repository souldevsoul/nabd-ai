/**
 * @fileoverview Disallow mentions of digital wallets and payment processor names
 * @description B2C payment compliance requires hiding acquirer/processor names:
 * - Apple Pay, Google Pay, Samsung Pay
 * - Stripe, Ecommpay, PayPal (as payment method options)
 * - Cryptocurrency wallets
 * - "Digital wallet" terminology in B2C context
 */

'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow mentions of digital wallets and payment processor names in B2C UI',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      digitalWallet: 'Remove digital wallet mention ({{name}}) - B2C UI should not expose payment methods',
      paymentProcessor: 'Remove payment processor name ({{name}}) - acquirer names should not be visible to end users',
      cryptoWallet: 'Remove cryptocurrency wallet mention - not compliant with standard payment processing',
      genericWallet: 'Remove "digital wallet" terminology - use "card payment" or "secure checkout" instead',
    },
    schema: [],
  },

  create(context) {
    // File path check - only check UI/component files
    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Skip backend/API files where processor names are legitimate
    const backendPatterns = /\/(api|server|lib|utils|services|hooks)\//i;
    const configPatterns = /\.(config|env)/i;

    // Digital wallet patterns
    const digitalWalletPattern = /\b(apple\s*pay|google\s*pay|samsung\s*pay|amazon\s*pay|ali\s*pay|wechat\s*pay)\b/i;

    // Payment processor patterns (should not appear in B2C UI)
    const paymentProcessorPattern = /\b(stripe|ecommpay|ecm?pay|adyen|braintree|worldpay|authorize\.?net|square\s*payments?)\b/i;

    // Generic digital wallet terminology
    const genericWalletPattern = /\b(digital\s+wallet|e-?wallet|mobile\s+wallet|payment\s+wallet)\b/i;

    // Crypto wallet patterns
    const cryptoWalletPattern = /\b(crypto\s*wallet|bitcoin\s*wallet|ethereum\s*wallet|metamask|coinbase\s*wallet)\b/i;

    // Allowed contexts (documentation, error handling, backend config)
    const allowedContextPattern = /\b(config|documentation|error|debug|log|api|webhook)\b/i;

    function isBackendFile() {
      return backendPatterns.test(filename) || configPatterns.test(filename);
    }

    function checkText(node, text) {
      if (!text || typeof text !== 'string') return;

      // Skip backend/config files
      if (isBackendFile()) return;

      // Skip allowed contexts
      if (allowedContextPattern.test(text)) return;

      const walletMatch = text.match(digitalWalletPattern);
      if (walletMatch) {
        context.report({
          node,
          messageId: 'digitalWallet',
          data: { name: walletMatch[1] },
        });
        return;
      }

      const processorMatch = text.match(paymentProcessorPattern);
      if (processorMatch) {
        context.report({
          node,
          messageId: 'paymentProcessor',
          data: { name: processorMatch[1] },
        });
        return;
      }

      if (cryptoWalletPattern.test(text)) {
        context.report({
          node,
          messageId: 'cryptoWallet',
        });
        return;
      }

      if (genericWalletPattern.test(text)) {
        context.report({
          node,
          messageId: 'genericWallet',
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
