/**
 * ESLint Rule: no-generic-placeholders
 * 
 * Avoids generic placeholder text like "Enter text", "Click here".
 * Placeholders should be specific and helpful.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid generic placeholder text like "Enter text", "Click here"',
      category: 'UX Consistency',
      recommended: true,
    },
    messages: {
      genericPlaceholder:
        'Generic placeholder "{{text}}" should be more specific. Example: "Enter your email address"',
    },
    schema: [],
  },
  create(context) {
    const genericPhrases = ['click here', 'click me', 'enter text', 'type here', 'input text', 'enter value'];

    return {
      JSXAttribute(node) {
        if (node.name?.name === 'placeholder' && node.value?.value) {
          const value = node.value.value.toLowerCase().trim();

          if (genericPhrases.includes(value)) {
            context.report({
              node,
              messageId: 'genericPlaceholder',
              data: { text: node.value.value },
            });
          }
        }
      },
    };
  },
};
