/**
 * ESLint Rule: require-try-catch-fetch
 * 
 * Fetch calls should be wrapped in try-catch.
 * API calls can fail and should handle errors gracefully.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Fetch calls should be wrapped in try-catch',
      category: 'Error Handling',
      recommended: true,
    },
    messages: {
      missingTryCatch:
        'Fetch call not wrapped in try-catch. API calls can fail and should handle errors gracefully.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.name === 'fetch' ||
          (node.callee.type === 'MemberExpression' && node.callee.property.name === 'fetch')
        ) {
          let parent = node.parent;
          let inTryCatch = false;

          while (parent) {
            if (parent.type === 'TryStatement') {
              inTryCatch = true;
              break;
            }
            parent = parent.parent;
          }

          if (!inTryCatch) {
            context.report({
              node,
              messageId: 'missingTryCatch',
            });
          }
        }
      },
    };
  },
};
