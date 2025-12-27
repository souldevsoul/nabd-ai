/**
 * ESLint Rule: anchor-has-content
 *
 * Enforces that anchor elements have content and that the content is accessible
 * to screen readers. Accessible means that it is not hidden using aria-hidden.
 *
 * Based on eslint-plugin-jsx-a11y anchor-has-content rule.
 *
 * @version 1.27.0
 * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-has-content.md
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Anchor elements must have content accessible to screen readers',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      noContent:
        'Anchors must have content. Provide text content, an aria-label, or aria-labelledby attribute.',
      hiddenContent:
        'Anchor content is hidden from screen readers with aria-hidden="true". Remove aria-hidden or add aria-label.',
    },
    schema: [],
  },

  create(context) {
    return {
      JSXElement(node) {
        const openingElement = node.openingElement;
        const elementName = openingElement.name?.name;

        // Check anchor elements and Link components
        if (elementName !== 'a' && elementName !== 'Link') {
          return;
        }

        const attributes = openingElement.attributes || [];

        // Check for aria-label or aria-labelledby
        const hasAriaLabel = attributes.some(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            (attr.name.name === 'aria-label' || attr.name.name === 'aria-labelledby') &&
            attr.value &&
            (attr.value.type === 'Literal' ? attr.value.value?.trim() : true)
        );

        if (hasAriaLabel) {
          return; // Has accessible label
        }

        // Check for title attribute (fallback accessibility)
        const hasTitle = attributes.some(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name.name === 'title' &&
            attr.value &&
            (attr.value.type === 'Literal' ? attr.value.value?.trim() : true)
        );

        if (hasTitle) {
          return; // Has title fallback
        }

        // Check children for content
        const children = node.children || [];

        // Filter out whitespace-only text nodes
        const meaningfulChildren = children.filter((child) => {
          if (child.type === 'JSXText') {
            return child.value.trim().length > 0;
          }
          return child.type === 'JSXElement' || child.type === 'JSXExpressionContainer';
        });

        if (meaningfulChildren.length === 0) {
          context.report({
            node,
            messageId: 'noContent',
          });
          return;
        }

        // Check if all children are hidden with aria-hidden
        const allHidden = meaningfulChildren.every((child) => {
          if (child.type === 'JSXElement') {
            const childAttrs = child.openingElement?.attributes || [];
            return childAttrs.some(
              (attr) =>
                attr.type === 'JSXAttribute' &&
                attr.name.name === 'aria-hidden' &&
                attr.value?.type === 'Literal' &&
                attr.value.value === true
            );
          }
          return false;
        });

        if (allHidden && meaningfulChildren.length > 0) {
          context.report({
            node,
            messageId: 'hiddenContent',
          });
        }
      },
    };
  },
};
