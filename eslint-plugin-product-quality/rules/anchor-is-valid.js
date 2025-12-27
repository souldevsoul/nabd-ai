/**
 * ESLint Rule: anchor-is-valid
 *
 * Enforces that anchors have valid hrefs. Anchors with href="#", href="javascript:",
 * or without href should use button elements instead.
 *
 * Based on eslint-plugin-jsx-a11y anchor-is-valid rule.
 *
 * @version 1.27.0
 * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Anchor elements must have valid href attributes',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      noHref:
        'Anchor element without href. Use a <button> element for click handlers, or add a valid href.',
      invalidHref:
        'Anchor href "{{href}}" is invalid. Use a valid URL or use <button> for actions.',
      javascriptVoid:
        'Anchor with "javascript:" href is invalid. Use onClick with <button> instead.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowHash: {
            type: 'boolean',
            description: 'Allow href="#" (default: false)',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowHash = options.allowHash || false;

    return {
      JSXOpeningElement(node) {
        const elementName = node.name?.name;

        // Only check anchor elements (not Link components which handle routing)
        if (elementName !== 'a') {
          return;
        }

        const attributes = node.attributes || [];

        // Find href attribute
        const hrefAttr = attributes.find(
          (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'href'
        );

        // Check for onClick without href
        const hasOnClick = attributes.some(
          (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'onClick'
        );

        // No href attribute
        if (!hrefAttr) {
          if (hasOnClick) {
            context.report({
              node,
              messageId: 'noHref',
            });
          }
          return;
        }

        // Get href value
        let hrefValue = null;
        if (hrefAttr.value?.type === 'Literal') {
          hrefValue = hrefAttr.value.value;
        } else if (
          hrefAttr.value?.type === 'JSXExpressionContainer' &&
          hrefAttr.value.expression?.type === 'Literal'
        ) {
          hrefValue = hrefAttr.value.expression.value;
        }

        // Skip dynamic hrefs (template literals, variables)
        if (hrefValue === null) {
          return;
        }

        // Check for javascript: protocol
        if (typeof hrefValue === 'string' && hrefValue.toLowerCase().startsWith('javascript:')) {
          context.report({
            node,
            messageId: 'javascriptVoid',
          });
          return;
        }

        // Check for empty or hash-only href
        if (hrefValue === '' || hrefValue === '#') {
          if (!allowHash || hrefValue === '') {
            context.report({
              node,
              messageId: 'invalidHref',
              data: { href: hrefValue || '(empty)' },
            });
          }
          return;
        }

        // Check for # with fragment but no base (like "#section")
        // This is valid for in-page navigation, so we allow it
      },
    };
  },
};
