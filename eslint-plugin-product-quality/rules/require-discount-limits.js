/**
 * Rule: require-discount-limits
 * Ensures discounts are within payment processor acceptable limits
 *
 * Acquirers question large discounts. Acceptable: 3%, 5%, 8%, 12%, 15%
 * Maximum recommended: 15%
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure discounts are within payment processor limits (max 15%)',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      excessiveDiscount: 'Discount {{value}}% exceeds maximum allowed (15%). Use: 3%, 5%, 8%, 12%, or 15%.',
      unusualDiscount: 'Discount {{value}}% is unusual. Recommended: 3%, 5%, 8%, 12%, or 15%.',
    },
    schema: [],
  },

  create(context) {
    // Acceptable discount values
    const acceptableDiscounts = [3, 5, 8, 10, 12, 15];
    const maxDiscount = 15;

    // Patterns that indicate discount context
    const discountPatterns = [
      /(\d+)\s*%\s*off/i,
      /save\s*(\d+)\s*%/i,
      /(\d+)\s*%\s*discount/i,
      /(\d+)\s*%\s*saving/i,
      /discount[:\s]*(\d+)\s*%/i,
      /-(\d+)%/,
    ];

    // Check if a number is in discount context
    function checkDiscountValue(node, value) {
      if (typeof value !== 'number' || value <= 0 || value > 100) return;

      // Only check values that look like percentages in context
      if (value > maxDiscount) {
        context.report({
          node,
          messageId: 'excessiveDiscount',
          data: { value: value.toString() },
        });
      } else if (!acceptableDiscounts.includes(value) && value > 2) {
        // Warn about unusual discount values (skip 1-2 as they're rarely discounts)
        context.report({
          node,
          messageId: 'unusualDiscount',
          data: { value: value.toString() },
        });
      }
    }

    // Extract discount percentage from text
    function checkDiscountText(node, text) {
      if (!text || typeof text !== 'string') return;

      // Skip CSS class names (Tailwind, etc.)
      if (text.includes('translate') || text.includes('zoom') ||
          text.includes('scale') || text.includes('opacity') ||
          text.includes('data-[') || text.includes('className')) {
        return;
      }

      for (const pattern of discountPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const discountValue = parseInt(match[1], 10);
          if (discountValue > 0 && discountValue <= 100) {
            if (discountValue > maxDiscount) {
              context.report({
                node,
                messageId: 'excessiveDiscount',
                data: { value: discountValue.toString() },
              });
            } else if (!acceptableDiscounts.includes(discountValue) && discountValue > 2) {
              context.report({
                node,
                messageId: 'unusualDiscount',
                data: { value: discountValue.toString() },
              });
            }
          }
        }
      }
    }

    return {
      // Check string literals for discount text
      Literal(node) {
        if (typeof node.value === 'string') {
          checkDiscountText(node, node.value);
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          checkDiscountText(quasi, quasi.value.raw);
        });
      },

      // Check JSX text
      JSXText(node) {
        checkDiscountText(node, node.value);
      },

      // Check variable assignments with discount in name
      VariableDeclarator(node) {
        if (!node.id || !node.id.name) return;

        const varName = node.id.name.toLowerCase();
        // Only match explicit discount variables, not generic "off" or "percent"
        const isDiscountVar = /discount|saving/i.test(varName);

        if (isDiscountVar && node.init) {
          if (node.init.type === 'Literal' && typeof node.init.value === 'number') {
            checkDiscountValue(node.init, node.init.value);
          }
        }
      },

      // Check object properties with discount-related keys
      Property(node) {
        if (!node.key) return;

        const keyName = node.key.name || node.key.value;
        if (!keyName) return;

        // Skip CSS-related properties
        const cssProperties = [
          'offset', 'underlineOffset', 'textUnderlineOffset',
          'borderWidth', 'padding', 'margin', 'width', 'height',
          'top', 'left', 'right', 'bottom', 'size', 'spacing',
          'gap', 'radius', 'shadow', 'blur', 'spread',
        ];
        if (cssProperties.some(css => keyName.toString().toLowerCase().includes(css.toLowerCase()))) {
          return;
        }

        // Only match explicit discount keys
        const isDiscountKey = /discount|saving/i.test(keyName.toString());

        if (isDiscountKey && node.value && node.value.type === 'Literal') {
          if (typeof node.value.value === 'number') {
            checkDiscountValue(node.value, node.value.value);
          }
        }
      },
    };
  },
};
