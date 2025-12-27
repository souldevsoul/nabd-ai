/**
 * ESLint Rule: require-empty-state
 * 
 * Lists/grids should handle empty state with helpful message.
 * Show helpful message when data is empty.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Lists/grids should handle empty state with helpful message',
      category: 'UX Consistency',
      recommended: true,
    },
    messages: {
      missingEmptyState: 'Array map without empty state check. Show helpful message when data is empty.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();

    // Skip API routes - they return JSON, not UI
    if (filename.includes('/api/') || filename.includes('/route.')) {
      return {};
    }

    // Skip sitemap, robots, image generators - static data, always has content
    if (filename.includes('sitemap') || filename.includes('robots') ||
        filename.includes('opengraph-image') || filename.includes('twitter-image')) {
      return {};
    }

    // Track constant arrays defined at module level
    const constantArrays = new Set();

    return {
      // Track const array definitions
      VariableDeclarator(node) {
        // Check if this is a const declaration with an array
        if (node.parent && node.parent.kind === 'const' &&
            node.init && node.init.type === 'ArrayExpression' &&
            node.id && node.id.name) {
          // Array has at least one element - it's a constant with data
          if (node.init.elements && node.init.elements.length > 0) {
            constantArrays.add(node.id.name);
          }
        }
      },

      CallExpression(node) {
        if (node.callee.type === 'MemberExpression' && node.callee.property.name === 'map') {
          // Get the array being mapped
          const arrayNode = node.callee.object;

          // If mapping over a known constant array, skip
          if (arrayNode.type === 'Identifier' && constantArrays.has(arrayNode.name)) {
            return;
          }

          let parent = node.parent;
          let hasLengthCheck = false;

          while (parent && parent.type !== 'Program') {
            if (
              parent.type === 'ConditionalExpression' ||
              parent.type === 'IfStatement' ||
              parent.type === 'LogicalExpression'
            ) {
              const source = context.getSourceCode();
              const parentText = source.getText(parent);

              if (
                parentText.includes('.length') ||
                parentText.includes('?.length') ||
                parentText.includes('isEmpty') ||
                parentText.includes('hasData')
              ) {
                hasLengthCheck = true;
                break;
              }
            }
            parent = parent.parent;
          }

          if (!hasLengthCheck) {
            context.report({
              node,
              messageId: 'missingEmptyState',
            });
          }
        }
      },
    };
  },
};
