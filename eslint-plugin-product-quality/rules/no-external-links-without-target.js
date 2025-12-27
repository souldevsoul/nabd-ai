/**
 * @fileoverview External links should open in new tab with security attributes
 * @author AutoQA
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'External links should open in new tab with security attributes',
      category: 'Product Quality',
      recommended: true,
    },
    messages: {
      missingTarget: 'External link should have target="_blank" rel="noopener noreferrer"',
      missingRel: 'External link with target="_blank" missing rel="noopener noreferrer"',
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    return {
      JSXElement(node) {
        if (node.openingElement.name.name === 'a' || node.openingElement.name.name === 'Link') {
          const attributes = node.openingElement.attributes;
          const hrefAttr = attributes.find((attr) => attr.name?.name === 'href');
          const targetAttr = attributes.find((attr) => attr.name?.name === 'target');
          const relAttr = attributes.find((attr) => attr.name?.name === 'rel');

          if (hrefAttr?.value?.value) {
            const href = hrefAttr.value.value;
            const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');

            if (isExternal) {
              if (!targetAttr) {
                context.report({
                  node: hrefAttr,
                  messageId: 'missingTarget',
                  fix(fixer) {
                    const lastAttr = attributes[attributes.length - 1];
                    return fixer.insertTextAfter(lastAttr, ' target="_blank" rel="noopener noreferrer"');
                  },
                });
              } else if (targetAttr.value?.value === '_blank' && !relAttr) {
                context.report({
                  node: targetAttr,
                  messageId: 'missingRel',
                  fix(fixer) {
                    return fixer.insertTextAfter(targetAttr, ' rel="noopener noreferrer"');
                  },
                });
              }
            }
          }
        }
      },
    };
  },
};
