/**
 * ESLint Rule: no-positive-tabindex
 *
 * Warns against using positive tabIndex values.
 * Positive tabIndex disrupts natural keyboard navigation order
 * and creates accessibility issues.
 *
 * Valid values:
 * - tabIndex={0}: Element is focusable in natural order
 * - tabIndex={-1}: Element is programmatically focusable but not in tab order
 *
 * Invalid values:
 * - tabIndex={1}, tabIndex={5}, etc.: Disrupts natural tab order
 *
 * WCAG 2.1: 2.4.3 Focus Order
 *
 * @version 1.0.0
 * @category Accessibility
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow positive tabIndex values',
      category: 'Accessibility',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      noPositiveTabindex: 'Avoid using positive tabIndex ({{value}}). Use tabIndex={0} or tabIndex={-1} instead. Positive values disrupt natural keyboard navigation.',
      preferZero: 'Consider using tabIndex={0} to add element to natural tab order.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')) {
      return {};
    }

    function checkTabIndexValue(node, value) {
      if (typeof value === 'number' && value > 0) {
        context.report({
          node,
          messageId: 'noPositiveTabindex',
          data: { value: value.toString() },
          fix(fixer) {
            // Auto-fix to tabIndex={0}
            if (node.type === 'JSXAttribute') {
              return fixer.replaceText(node, 'tabIndex={0}');
            }
            return null;
          },
        });
      }
    }

    return {
      // JSX: tabIndex={5} or tabIndex="5"
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier') return;

        const propName = node.name.name.toLowerCase();
        if (propName !== 'tabindex') return;

        const value = node.value;

        // tabIndex={5}
        if (value && value.type === 'JSXExpressionContainer') {
          const expr = value.expression;
          if (expr.type === 'Literal' && typeof expr.value === 'number') {
            checkTabIndexValue(node, expr.value);
          }
          // Handle numeric unary expression like tabIndex={+5}
          if (expr.type === 'UnaryExpression' && expr.operator === '+') {
            if (expr.argument.type === 'Literal' && typeof expr.argument.value === 'number') {
              checkTabIndexValue(node, expr.argument.value);
            }
          }
        }

        // tabIndex="5" (string value)
        if (value && value.type === 'Literal' && typeof value.value === 'string') {
          const numValue = parseInt(value.value, 10);
          if (!isNaN(numValue) && numValue > 0) {
            checkTabIndexValue(node, numValue);
          }
        }
      },

      // HTML attributes in template literals or DOM manipulation
      Property(node) {
        if (node.key.type !== 'Identifier') return;

        const propName = node.key.name.toLowerCase();
        if (propName !== 'tabindex') return;

        if (node.value.type === 'Literal' && typeof node.value.value === 'number') {
          if (node.value.value > 0) {
            context.report({
              node,
              messageId: 'noPositiveTabindex',
              data: { value: node.value.value.toString() },
            });
          }
        }
      },
    };
  },
};
