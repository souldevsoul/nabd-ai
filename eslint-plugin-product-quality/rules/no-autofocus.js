/**
 * ESLint Rule: no-autofocus
 *
 * Prevents use of autoFocus attribute on elements.
 * Autofocus disrupts keyboard navigation and screen reader flow.
 *
 * WCAG 2.1 Success Criterion 3.2.1 (Level A): On Focus
 * - Focus should not cause unexpected context changes
 * - Users should control when focus moves
 *
 * Exceptions:
 * - Modal dialogs (where autofocus on close button is acceptable)
 * - Search inputs in search-focused pages
 *
 * @version 1.0.0
 * @category Accessibility
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow autoFocus attribute for better accessibility',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      noAutofocus: 'Avoid using autoFocus. It disrupts keyboard navigation and screen reader flow. Let users control focus.',
      noAutofocusModal: 'autoFocus in modals should focus the close button or first interactive element, not form inputs.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInModals: {
            type: 'boolean',
            description: 'Allow autoFocus in modal dialogs',
            default: false,
          },
          allowInSearch: {
            type: 'boolean',
            description: 'Allow autoFocus on search inputs',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowInModals = options.allowInModals || false;
    const allowInSearch = options.allowInSearch || false;

    // Check if element is inside a modal
    function isInModal(node) {
      let current = node;
      while (current) {
        if (current.type === 'JSXElement' && current.openingElement) {
          const attrs = current.openingElement.attributes || [];

          // Check for role="dialog" or aria-modal="true"
          const hasDialogRole = attrs.some(
            (attr) =>
              attr.type === 'JSXAttribute' &&
              attr.name.name === 'role' &&
              attr.value?.value === 'dialog'
          );

          const hasAriaModal = attrs.some(
            (attr) =>
              attr.type === 'JSXAttribute' &&
              attr.name.name === 'aria-modal' &&
              (attr.value?.value === 'true' || attr.value?.value === true)
          );

          // Check for common modal component names
          const name = current.openingElement.name;
          const componentName = name.type === 'JSXIdentifier' ? name.name : '';
          const isModalComponent = /modal|dialog|drawer|sheet/i.test(componentName);

          if (hasDialogRole || hasAriaModal || isModalComponent) {
            return true;
          }
        }
        current = current.parent;
      }
      return false;
    }

    // Check if element is a search input
    function isSearchInput(node) {
      const attrs = node.attributes || [];

      // Check for type="search"
      const isTypeSearch = attrs.some(
        (attr) =>
          attr.type === 'JSXAttribute' &&
          attr.name.name === 'type' &&
          attr.value?.value === 'search'
      );

      // Check for role="search" on parent
      let current = node.parent;
      while (current) {
        if (current.type === 'JSXElement' && current.openingElement) {
          const parentAttrs = current.openingElement.attributes || [];
          const hasSearchRole = parentAttrs.some(
            (attr) =>
              attr.type === 'JSXAttribute' &&
              attr.name.name === 'role' &&
              attr.value?.value === 'search'
          );
          if (hasSearchRole) return true;
        }
        current = current.parent;
      }

      // Check for search-related names
      const name = node.name;
      const componentName = name?.type === 'JSXIdentifier' ? name.name : '';
      const isSearchComponent = /search/i.test(componentName);

      return isTypeSearch || isSearchComponent;
    }

    return {
      JSXAttribute(node) {
        // Check for autoFocus or autofocus attribute
        const attrName = node.name.name;
        if (attrName !== 'autoFocus' && attrName !== 'autofocus') {
          return;
        }

        const element = node.parent;

        // Check exceptions
        if (allowInModals && isInModal(element)) {
          return;
        }

        if (allowInSearch && isSearchInput(element)) {
          return;
        }

        // Report the violation
        context.report({
          node,
          messageId: 'noAutofocus',
        });
      },
    };
  },
};
