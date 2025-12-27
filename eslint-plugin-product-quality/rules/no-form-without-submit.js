/**
 * ESLint Rule: no-form-without-submit
 * 
 * Forms must have onSubmit handler.
 * Forms should handle submission explicitly.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forms must have onSubmit handler',
      category: 'UX Consistency',
      recommended: true,
    },
    messages: {
      missingSubmit: 'Form has no onSubmit handler. Forms should handle submission explicitly.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXElement(node) {
        if (node.openingElement.name.name === 'form') {
          const attributes = node.openingElement.attributes;
          const hasOnSubmit = attributes.some((attr) => attr.name?.name === 'onSubmit');
          const hasAction = attributes.some((attr) => attr.name?.name === 'action');

          if (!hasOnSubmit && !hasAction) {
            context.report({
              node,
              messageId: 'missingSubmit',
            });
          }
        }
      },
    };
  },
};
