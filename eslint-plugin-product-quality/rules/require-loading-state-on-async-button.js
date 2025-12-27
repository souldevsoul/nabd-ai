/**
 * ESLint Rule: require-loading-state-on-async-button
 * 
 * Buttons with async onClick should show loading state.
 * Users need feedback during async operations.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Buttons with async onClick should show loading state',
      category: 'UX Consistency',
      recommended: true,
    },
    messages: {
      missingLoadingState:
        'Async button onClick should have loading state. Users need feedback during async operations.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        if (elementName === 'button' || elementName === 'Button') {
          const attributes = node.openingElement.attributes;
          const onClickAttr = attributes.find((attr) => attr.name?.name === 'onClick');

          if (onClickAttr?.value?.expression) {
            const source = context.getSourceCode();
            const onClickCode = source.getText(onClickAttr.value.expression);

            const isAsync =
              onClickCode.includes('async') ||
              onClickCode.includes('await') ||
              onClickCode.includes('fetch(') ||
              onClickCode.includes('.then(');

            if (isAsync) {
              const hasLoadingProp = attributes.some(
                (attr) =>
                  attr.name?.name === 'loading' ||
                  attr.name?.name === 'isLoading' ||
                  attr.name?.name === 'disabled',
              );

              if (!hasLoadingProp) {
                context.report({
                  node: onClickAttr,
                  messageId: 'missingLoadingState',
                });
              }
            }
          }
        }
      },
    };
  },
};
