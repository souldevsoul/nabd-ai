/**
 * @fileoverview Require proper form accessibility and validation
 * @author AutoQA
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure forms are accessible and have proper validation',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingFormLabel: 'Form input should have an associated label',
      missingFormAction: 'Form should have an onSubmit or action attribute',
      missingInputType: 'Input should have a type attribute',
      missingRequiredValidation: 'Required input should have validation or required attribute',
      missingEmailValidation: 'Email input should have type="email" for validation',
      missingAriaLabel: 'Form control should have aria-label when label is not visible',
      missingFieldset: 'Radio/checkbox group should be wrapped in fieldset with legend',
    },
    schema: [{
      type: 'object',
      properties: {
        requireLabels: {
          type: 'boolean',
          default: true,
        },
        requireValidation: {
          type: 'boolean',
          default: true,
        },
        requireFormAction: {
          type: 'boolean',
          default: true,
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    const options = context.options[0] || {};
    const requireLabels = options.requireLabels !== false;
    const requireValidation = options.requireValidation !== false;
    const requireFormAction = options.requireFormAction !== false;

    const inputsWithLabels = new Set();
    const allInputs = [];

    return {
      // Check <form> elements
      JSXElement(node) {
        const openingElement = node.openingElement;
        const tagName = openingElement.name.name;

        // Check forms have onSubmit or action
        if (tagName === 'form' && requireFormAction) {
          const hasOnSubmit = openingElement.attributes.some(
            attr => attr.name && attr.name.name === 'onSubmit'
          );
          const hasAction = openingElement.attributes.some(
            attr => attr.name && attr.name.name === 'action'
          );

          if (!hasOnSubmit && !hasAction) {
            context.report({
              node,
              messageId: 'missingFormAction',
            });
          }
        }

        // Check input elements
        if (['input', 'textarea', 'select'].includes(tagName)) {
          allInputs.push(node);

          // Check for type attribute
          if (tagName === 'input') {
            const hasType = openingElement.attributes.some(
              attr => attr.name && attr.name.name === 'type'
            );

            if (!hasType) {
              context.report({
                node,
                messageId: 'missingInputType',
              });
            }

            // Check email inputs
            const typeAttr = openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'type'
            );
            const nameAttr = openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'name'
            );

            if (
              nameAttr &&
              nameAttr.value &&
              nameAttr.value.value &&
              nameAttr.value.value.toLowerCase().includes('email')
            ) {
              if (!typeAttr || typeAttr.value.value !== 'email') {
                context.report({
                  node,
                  messageId: 'missingEmailValidation',
                });
              }
            }
          }

          // Check for aria-label or associated label
          const hasAriaLabel = openingElement.attributes.some(
            attr => attr.name && (attr.name.name === 'aria-label' || attr.name.name === 'aria-labelledby')
          );
          const hasId = openingElement.attributes.some(
            attr => attr.name && attr.name.name === 'id'
          );

          if (hasId) {
            const idAttr = openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'id'
            );
            if (idAttr && idAttr.value) {
              inputsWithLabels.add(idAttr.value.value);
            }
          }

          if (!hasAriaLabel && !hasId && requireLabels) {
            context.report({
              node,
              messageId: 'missingFormLabel',
            });
          }
        }

        // Check for label elements
        if (tagName === 'label') {
          const htmlForAttr = openingElement.attributes.find(
            attr => attr.name && attr.name.name === 'htmlFor'
          );

          if (htmlForAttr && htmlForAttr.value) {
            inputsWithLabels.add(htmlForAttr.value.value);
          }
        }
      },

      'Program:exit'() {
        // Check if inputs have associated labels
        if (requireLabels) {
          allInputs.forEach(inputNode => {
            const openingElement = inputNode.openingElement;
            const idAttr = openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'id'
            );

            if (idAttr && idAttr.value) {
              const inputId = idAttr.value.value;
              if (!inputsWithLabels.has(inputId)) {
                const hasAriaLabel = openingElement.attributes.some(
                  attr => attr.name && (attr.name.name === 'aria-label' || attr.name.name === 'aria-labelledby')
                );

                if (!hasAriaLabel) {
                  context.report({
                    node: inputNode,
                    messageId: 'missingFormLabel',
                  });
                }
              }
            }
          });
        }
      },
    };
  },
};
