/**
 * ESLint Rule: require-image-optimization
 * 
 * Use Next.js Image component instead of img tag for automatic optimization.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use Next.js Image component instead of img tag',
      category: 'Performance',
      recommended: true,
    },
    messages: {
      useNextImage: 'Use Next.js <Image> component instead of <img> for automatic optimization.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXElement(node) {
        if (node.openingElement.name.name === 'img') {
          const filename = context.getFilename();
          if (filename.includes('/app/') || filename.includes('/pages/') || filename.includes('/src/')) {
            context.report({
              node,
              messageId: 'useNextImage',
            });
          }
        }
      },
    };
  },
};
