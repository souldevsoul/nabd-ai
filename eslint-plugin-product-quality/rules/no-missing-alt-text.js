/**
 * ESLint Rule: no-missing-alt-text
 * 
 * Images must have alt text for accessibility.
 * Add alt="" for decorative images or descriptive alt text.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Images must have alt text for accessibility',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      missingAlt: 'Image missing alt attribute. Add alt="" for decorative images or descriptive alt text.',
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    return {
      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        if (elementName === 'img' || elementName === 'Image') {
          const attributes = node.openingElement.attributes;
          const altAttr = attributes.find((attr) => attr.name?.name === 'alt');

          if (!altAttr) {
            context.report({
              node,
              messageId: 'missingAlt',
              fix(fixer) {
                const lastAttr = attributes[attributes.length - 1];
                if (lastAttr) {
                  return fixer.insertTextAfter(lastAttr, ' alt=""');
                }
                // If no attributes, insert after element name
                return fixer.insertTextAfter(node.openingElement.name, ' alt=""');
              },
            });
          }
        }
      },
    };
  },
};
