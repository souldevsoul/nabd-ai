/**
 * ESLint Rule: require-aria-label-on-icon-buttons
 * 
 * Icon-only buttons need aria-label for screen readers.
 * Screen readers need descriptive text.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Icon-only buttons need aria-label for screen readers',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      missingAriaLabel: 'Icon button missing aria-label. Screen readers need descriptive text.',
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    return {
      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        if (elementName === 'button' || elementName === 'Button') {
          const attributes = node.openingElement.attributes;
          const hasAriaLabel = attributes.some(
            (attr) => attr.name?.name === 'aria-label' || attr.name?.name === 'aria-labelledby',
          );

          const hasTextChild = node.children.some(
            (child) => child.type === 'JSXText' && child.value.trim().length > 0,
          );

          const source = context.getSourceCode();
          const buttonContent = source.getText(node);
          const hasIcon = /Icon|icon|svg|SVG|Ri[A-Z]|Lucide|Menu|X|Close|Search|Arrow/.test(buttonContent);

          if (hasIcon && !hasTextChild && !hasAriaLabel) {
            context.report({
              node,
              messageId: 'missingAriaLabel',
              fix(fixer) {
                const lastAttr = attributes[attributes.length - 1];
                if (lastAttr) {
                  return fixer.insertTextAfter(lastAttr, ' aria-label="Button"');
                }
                // If no attributes, insert after element name
                return fixer.insertTextAfter(node.openingElement.name, ' aria-label="Button"');
              },
            });
          }
        }
      },
    };
  },
};
