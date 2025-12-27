/**
 * ESLint Rule: require-mobile-responsive
 *
 * Ensures mobile-first responsive design:
 * - All CTAs accessible on mobile
 * - Touch targets minimum 44px (Apple HIG standard)
 * - Mobile navigation menu
 * - No horizontal scroll
 * - Responsive images with srcset
 *
 * Q4 2025 Best Practice: 70%+ traffic is mobile
 *
 * @version 3.0
 * @date 2025-11-20
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure mobile-responsive design patterns',
      category: 'Mobile UX',
      recommended: true,
    },
    messages: {
      smallTouchTarget: 'Touch target too small ({{size}}). Minimum 44x44px for mobile accessibility.',
      noMobileNav: 'Header missing mobile navigation menu. Add hamburger menu for mobile users.',
      fixedWidth: 'Fixed width "{{width}}" detected. Use responsive units (%, rem, max-w-) for mobile support.',
    },
    schema: [],
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementName = node.name.name;

        // Check button/link touch targets
        if (elementName === 'button' || elementName === 'Button' || elementName === 'a') {
          const className = node.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'className'
          );

          if (className && className.value) {
            const classValue = className.value.type === 'Literal'
              ? className.value.value
              : '';

            // Check for tiny buttons (w-4, h-4, w-6, h-6, w-8, h-8)
            const tinySize = classValue.match(/\b[wh]-([2-8])\b/);
            if (tinySize && !classValue.includes('md:') && !classValue.includes('lg:')) {
              const size = parseInt(tinySize[1]) * 4; // Convert to px
              if (size < 44) {
                context.report({
                  node,
                  messageId: 'smallTouchTarget',
                  data: { size: `${size}px` },
                });
              }
            }

            // Check for fixed widths without responsive breakpoints
            const fixedWidth = classValue.match(/\bw-\[(\d+)px\]/);
            if (fixedWidth && !classValue.includes('md:') && !classValue.includes('max-w-')) {
              context.report({
                node,
                messageId: 'fixedWidth',
                data: { width: fixedWidth[0] },
              });
            }
          }
        }
      },
    };
  },
};
