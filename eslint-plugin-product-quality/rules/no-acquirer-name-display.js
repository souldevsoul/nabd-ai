/**
 * Rule: no-acquirer-name-display
 * Prohibits displaying payment processor/acquirer names
 *
 * CRITICAL: Never display acquirer name on the website.
 * This is a strict payment processor compliance requirement.
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibit displaying payment processor/acquirer names',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      acquirerNameDisplay: 'Payment processor name "{{name}}" must NOT be displayed. Remove acquirer references.',
    },
    schema: [],
  },

  create(context) {
    // Known payment processors/acquirers that should NOT be displayed
    const acquirerNames = [
      // Major acquirers
      'worldpay',
      'adyen',
      'checkout.com',
      'stripe', // Can be used as payment method, but not as "powered by Stripe"
      'paypal', // Often OK, but check context
      'square',
      'fiserv',
      'global payments',
      'worldline',
      'nets',
      'elavon',
      'barclaycard',
      'first data',
      'tsys',
      'paysafe',
      'nuvei',
      'rapyd',
      'payoneer',
      'airwallex',
      // European acquirers
      'concardis',
      'computop',
      'ingenico',
      'six payment',
      'wirecard',
      'payone',
      'heidelpay',
      'payu',
      'przelewy24',
      'trustly',
      'klarna', // OK as payment method, not as processor
      // Processing mentions to avoid (only when naming specific provider)
      'acquiring bank',
      // 'payment processor' - REMOVED: generic term allowed in legal/policy contexts
      // 'payment gateway' - REMOVED: generic term allowed
      'merchant services',
      // 'card processor' - REMOVED: generic term allowed
    ];

    // Patterns that indicate problematic display - only match when naming specific payment providers
    const problematicPatterns = [
      /powered\s+by\s+(stripe|paypal|adyen|worldpay|checkout\.com|square|braintree)/i,
      /payment\s+(?:processed|provided)\s+by\s+(stripe|paypal|adyen|worldpay|checkout\.com|square|braintree)/i,
      /processed\s+(?:via|through|by)\s+(stripe|paypal|adyen|worldpay|checkout\.com|square|braintree)/i,
      /our\s+(?:payment\s+)?(?:processor|acquirer|provider)\s+(?:is\s+)?(stripe|paypal|adyen|worldpay|checkout\.com|square|braintree)/i,
    ];

    function checkForAcquirerName(node, text) {
      if (!text || typeof text !== 'string') return;

      // Skip Tailwind CSS classes that contain acquirer words
      if (text.includes('aspect-square') || text.includes('rounded-square')) {
        return;
      }

      const lowerText = text.toLowerCase();

      // Check for acquirer names
      for (const acquirer of acquirerNames) {
        if (lowerText.includes(acquirer)) {
          // Allow as payment method button (e.g., "Pay with PayPal")
          const isPaymentMethod = /pay\s+with|checkout\s+with|use\s+/i.test(text);
          if (!isPaymentMethod) {
            context.report({
              node,
              messageId: 'acquirerNameDisplay',
              data: { name: acquirer },
            });
            return;
          }
        }
      }

      // Check for problematic patterns
      for (const pattern of problematicPatterns) {
        const match = text.match(pattern);
        if (match) {
          context.report({
            node,
            messageId: 'acquirerNameDisplay',
            data: { name: match[0] },
          });
          return;
        }
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          checkForAcquirerName(node, node.value);
        }
      },

      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          checkForAcquirerName(quasi, quasi.value.raw);
        });
      },

      JSXText(node) {
        checkForAcquirerName(node, node.value);
      },
    };
  },
};
