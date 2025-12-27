/**
 * ESLint Rule: consistent-payment-providers
 * 
 * Ensures payment provider mentions are consistent.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure payment provider mentions are consistent',
      category: 'Content Consistency',
      recommended: true,
    },
    messages: {
      inconsistentProvider:
        'Payment provider "{{provider}}" used here, but config specifies "{{configured}}". Keep consistent.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          provider: {
            oneOf: [
              {
                type: 'string',
                enum: ['stripe', 'ecommpay', 'paypal', 'square'],
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['stripe', 'ecommpay', 'paypal', 'square'],
                },
              },
            ],
          },
        },
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const configuredProvider = options.provider || 'stripe';
    const allowedProviders = Array.isArray(configuredProvider) ? configuredProvider : [configuredProvider];

    const providerPatterns = {
      stripe: /\bstripe\b/i,
      ecommpay: /\becommpay\b/i,
      paypal: /\bpaypal\b/i,
      square: /\bsquare\b/i,
    };

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          // Skip CSS class names (aspect-square, etc)
          if (node.value.includes('aspect-') || node.value.includes('className')) {
            return;
          }

          Object.entries(providerPatterns).forEach(([provider, pattern]) => {
            if (pattern.test(node.value) && !allowedProviders.includes(provider)) {
              context.report({
                node,
                messageId: 'inconsistentProvider',
                data: { provider, configured: allowedProviders.join(', ') },
              });
            }
          });
        }
      },
    };
  },
};
