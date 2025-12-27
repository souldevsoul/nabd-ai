/**
 * ESLint Rule: use-styleguide-colors-only
 * Enforces brand color palette consistency across the application.
 * Detects unauthorized Tailwind color classes (blue, yellow, orange, etc.)
 * @version 2.6
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce use of only allowed brand colors in className attributes',
      category: 'Brand Consistency',
      recommended: true,
    },
    messages: {
      unauthorizedColor: 'Unauthorized color "{{color}}" detected. Allowed colors: {{allowedColors}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedColors: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of allowed color patterns (e.g., "emerald-", "teal-", "slate-")',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedColors = options.allowedColors || [];

    // All possible Tailwind color names (excluding allowed ones)
    const allTailwindColors = [
      'blue', 'indigo', 'purple', 'pink', 'rose',
      'yellow', 'amber', 'orange', 'lime', 'cyan',
      'sky', 'violet', 'fuchsia',
    ];

    /**
     * Check if a color pattern is allowed
     */
    function isColorAllowed(colorName) {
      // Check if any allowed pattern matches
      return allowedColors.some(allowed => {
        if (allowed.endsWith('-')) {
          // Pattern like "emerald-" matches "emerald-500"
          return colorName.startsWith(allowed.replace('-', ''));
        } else {
          // Exact match like "black" or "white"
          return colorName === allowed;
        }
      });
    }

    /**
     * Extract color classes from className string
     */
    function extractColorClasses(classNameString) {
      if (!classNameString) return [];

      const classes = classNameString.split(/\s+/);
      const colorClasses = [];

      classes.forEach(cls => {
        // Match Tailwind color classes with optional modifiers
        // Examples: text-blue-500, hover:text-blue-500, focus:ring-blue-500, lg:text-blue-600
        // Pattern: (optional modifiers:)?(utility)-(color)-
        const match = cls.match(/(?:[\w-]+:)?(text|bg|border|ring|outline|shadow|from|to|via|decoration|divide|placeholder|accent|caret|fill|stroke)-(blue|indigo|purple|pink|rose|yellow|amber|orange|lime|cyan|sky|violet|fuchsia)-/);

        if (match) {
          const colorName = match[2]; // Extract color name (e.g., "blue")
          if (!isColorAllowed(colorName)) {
            colorClasses.push({
              fullClass: cls,
              colorName: colorName,
            });
          }
        }
      });

      return colorClasses;
    }

    /**
     * Extract className value from JSX attribute
     */
    function getClassNameValue(node) {
      const classAttr = node.attributes.find(
        attr => attr.type === 'JSXAttribute' && attr.name.name === 'className'
      );

      if (!classAttr || !classAttr.value) return null;

      // Handle string literals
      if (classAttr.value.type === 'Literal') {
        return classAttr.value.value;
      }

      // Handle JSX expressions
      if (classAttr.value.type === 'JSXExpressionContainer') {
        const expr = classAttr.value.expression;

        // Handle template literals
        if (expr.type === 'TemplateLiteral') {
          // Combine all static parts
          return expr.quasis.map(q => q.value.raw).join(' ');
        }

        // Handle string literals in expressions
        if (expr.type === 'Literal') {
          return expr.value;
        }

        // Handle function calls like cn(), clsx()
        if (expr.type === 'CallExpression') {
          return extractFromCallExpression(expr);
        }
      }

      return null;
    }

    /**
     * Extract class strings from function calls like cn(), clsx()
     */
    function extractFromCallExpression(callExpr) {
      if (!callExpr.arguments) return '';

      let classNames = '';

      callExpr.arguments.forEach(arg => {
        if (arg.type === 'Literal' && typeof arg.value === 'string') {
          classNames += ' ' + arg.value;
        } else if (arg.type === 'TemplateLiteral') {
          classNames += ' ' + arg.quasis.map(q => q.value.raw).join(' ');
        }
      });

      return classNames.trim();
    }

    return {
      JSXOpeningElement(node) {
        const className = getClassNameValue(node);
        if (!className) return;

        const violations = extractColorClasses(className);

        violations.forEach(violation => {
          context.report({
            node: node,
            messageId: 'unauthorizedColor',
            data: {
              color: violation.fullClass,
              allowedColors: allowedColors.join(', '),
            },
          });
        });
      },
    };
  },
};
