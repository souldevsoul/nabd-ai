/**
 * ESLint Rule: no-brutalist-design
 *
 * Detects brutalist design elements that don't match modern SaaS design systems.
 *
 * Modern SaaS uses soft, professional, minimal design with:
 * - Rounded corners (rounded-lg, rounded-xl, rounded-2xl)
 * - Soft shadows (shadow-sm, shadow-md, shadow-lg, shadow-xl)
 * - Subtle borders (border border-gray-200, border border-slate-200)
 * - Gradients (brand colors)
 *
 * This rule detects:
 * - border-* border-black (brutalist thick black borders)
 * - shadow-[*_#000] (brutalist hard shadows with black)
 * - brutalist-shadow* (brutalist shadow classes)
 * - hover:shadow-[*_#000] (brutalist hover shadows)
 *
 * @version 3.0 - Enhanced detection for all brutalist patterns
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow brutalist design elements that conflict with modern SaaS design',
      category: 'Design System',
      recommended: true,
    },
    messages: {
      noBrutalistBorder: 'Brutalist border "{{pattern}}" detected. Use modern design: "border border-gray-200 rounded-xl" instead.',
      noBrutalistShadow: 'Brutalist shadow "{{pattern}}" detected. Use soft shadows: "shadow-sm", "shadow-md", "shadow-lg", or "shadow-xl" instead.',
      noBrutalistHoverShadow: 'Brutalist hover shadow "{{pattern}}" detected. Use "hover:shadow-lg" or "hover:shadow-xl" instead.',
    },
    schema: [],
  },

  create(context) {
    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (node.name.name !== 'className') {
          return;
        }

        // Get the className value
        let className = '';
        if (node.value && node.value.type === 'Literal') {
          className = node.value.value;
        } else if (node.value && node.value.type === 'JSXExpressionContainer') {
          // Handle template literals and string expressions
          const expression = node.value.expression;
          if (expression.type === 'TemplateLiteral') {
            className = expression.quasis.map(q => q.value.raw).join(' ');
          } else if (expression.type === 'Literal') {
            className = expression.value;
          }
        }

        if (!className || typeof className !== 'string') {
          return;
        }

        // Check for brutalist borders (any thickness with black)
        // Matches: border-black, border-2 border-black, border-4 border-black, etc.
        const brutalistBorderPatterns = [
          /border(?:-\d+)?\s+border-black/,
          /border-black\s+border(?:-\d+)?/,
          /\bborder-black\b/,
        ];

        for (const pattern of brutalistBorderPatterns) {
          const match = className.match(pattern);
          if (match) {
            context.report({
              node,
              messageId: 'noBrutalistBorder',
              data: {
                pattern: match[0],
              },
            });
            return; // Report once per node
          }
        }

        // Check for brutalist hard shadows (shadow-[*_#000] or shadow-[*_0_0_#000])
        // Matches: shadow-[8px_8px_0_0_#000], shadow-[4px_4px_#000], etc.
        const brutalistShadowRegex = /shadow-\[[^\]]*#000[^\]]*\]/;
        const shadowMatch = className.match(brutalistShadowRegex);
        if (shadowMatch) {
          context.report({
            node,
            messageId: 'noBrutalistShadow',
            data: {
              pattern: shadowMatch[0],
            },
          });
          return;
        }

        // Check for brutalist hover shadows
        const brutalistHoverShadowRegex = /hover:shadow-\[[^\]]*#000[^\]]*\]/;
        const hoverShadowMatch = className.match(brutalistHoverShadowRegex);
        if (hoverShadowMatch) {
          context.report({
            node,
            messageId: 'noBrutalistHoverShadow',
            data: {
              pattern: hoverShadowMatch[0],
            },
          });
          return;
        }

        // Check for brutalist shadow classes
        const brutalistShadowPatterns = [
          'brutalist-shadow',
          'brutalist-shadow-yellow',
          'brutalist-shadow-black',
          'shadow-brutal',
        ];

        for (const pattern of brutalistShadowPatterns) {
          if (className.includes(pattern)) {
            context.report({
              node,
              messageId: 'noBrutalistShadow',
              data: {
                pattern,
              },
            });
            return;
          }
        }
      },
    };
  },
};
