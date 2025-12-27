/**
 * ESLint Rule: no-button-without-handler
 * 
 * Buttons should have onClick handler or type attribute.
 * Non-interactive buttons confuse users.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Buttons should have onClick handler or type attribute',
      category: 'UX Consistency',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      missingHandler: 'Button has no onClick handler or type. Non-interactive buttons confuse users.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        if (elementName === 'button' || elementName === 'Button') {
          const attributes = node.openingElement.attributes;
          const hasOnClick = attributes.some((attr) => attr.name?.name === 'onClick');
          const hasType = attributes.some((attr) => attr.name?.name === 'type');
          const hasAsChild = attributes.some((attr) => attr.name?.name === 'asChild');

          if (!hasOnClick && !hasType && !hasAsChild) {
            context.report({
              node,
              messageId: 'missingHandler',
              fix(fixer) {
                // Add type="button" as the safest fix
                // This prevents accidental form submission and makes intent explicit
                const openingElement = node.openingElement;
                const tagName = openingElement.name.name;
                const lastAttr = openingElement.attributes[openingElement.attributes.length - 1];

                if (lastAttr) {
                  // Insert after last attribute
                  return fixer.insertTextAfter(lastAttr, ' type="button"');
                } else {
                  // No attributes, insert after tag name
                  return fixer.insertTextAfter(openingElement.name, ' type="button"');
                }
              },
            });
          }
        }
      },
    };
  },
};
