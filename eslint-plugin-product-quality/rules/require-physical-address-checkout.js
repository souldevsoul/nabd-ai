/**
 * Rule: require-physical-address-checkout
 * Ensures checkout pages display physical merchant address
 *
 * Payment processor requirement:
 * - Checkout page must display Merchant Outlet Location (physical address)
 * - This is different from registration address in footer
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require physical merchant address on checkout page',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      missingMerchantAddress: 'Checkout page must display merchant physical address (Merchant Outlet Location). Add address element with merchant location.',
      missingAddressElement: 'Checkout component should include <address> element with merchant physical location.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only check actual checkout flow files, not policy/legal pages
    const checkoutPatterns = /checkout|cart|order/i;
    const excludePatterns = /policy|terms|privacy|refund|cancel|legal/i;

    const isCheckoutFile = checkoutPatterns.test(filename) &&
                          !excludePatterns.test(filename) &&
                          /\.(tsx|jsx)$/.test(filename);

    if (!isCheckoutFile) {
      return {};
    }

    let hasAddressElement = false;
    let hasMerchantLocation = false;
    let programNode = null;

    // Address-related patterns
    const addressPatterns = [
      /merchant\s*(?:address|location|outlet)/i,
      /physical\s*address/i,
      /business\s*address/i,
      /our\s*location/i,
      /company\s*address/i,
      /located\s*at/i,
    ];

    return {
      Program(node) {
        programNode = node;
      },

      // Check for <address> element
      JSXOpeningElement(node) {
        if (node.name && node.name.name === 'address') {
          hasAddressElement = true;
        }
      },

      // Check for merchant location text
      Literal(node) {
        if (typeof node.value === 'string') {
          for (const pattern of addressPatterns) {
            if (pattern.test(node.value)) {
              hasMerchantLocation = true;
              break;
            }
          }
        }
      },

      JSXText(node) {
        for (const pattern of addressPatterns) {
          if (pattern.test(node.value)) {
            hasMerchantLocation = true;
            break;
          }
        }
      },

      'Program:exit'() {
        // Only report on main checkout page files
        if (!/page\.(tsx|jsx)$/i.test(filename)) return;

        if (!hasAddressElement && !hasMerchantLocation) {
          context.report({
            node: programNode,
            messageId: 'missingMerchantAddress',
          });
        }
      },
    };
  },
};
