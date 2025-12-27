/**
 * ESLint Rule: no-console
 *
 * Prevents console.log and console.debug from leaking into production.
 * Allows console.error, console.warn for production error logging.
 *
 * @version 2.3
 * @date 2025-11-18
 * @strictness error (build fails if violated)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow console.log and console.debug (allows console.error/warn)',
      category: 'Production Quality',
      recommended: true,
    },
    messages: {
      unexpectedConsoleLog: 'Unexpected console.{{method}}(). Use conditional logging or remove it.',
      suggestRemove: 'Remove console.{{method}}()',
      suggestConditional: 'Wrap in if (process.env.NODE_ENV === "development")',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      MemberExpression(node) {
        // Check for console.log or console.debug
        if (
          node.object.name === 'console' &&
          node.property.type === 'Identifier' &&
          (node.property.name === 'log' || node.property.name === 'debug')
        ) {
          const method = node.property.name;

          context.report({
            node,
            messageId: 'unexpectedConsoleLog',
            data: { method },
            fix(fixer) {
              // Find the full statement (including parent CallExpression and ExpressionStatement)
              let statementNode = node;
              while (
                statementNode.parent &&
                statementNode.parent.type !== 'ExpressionStatement' &&
                statementNode.parent.type !== 'Program'
              ) {
                statementNode = statementNode.parent;
              }

              // If we found the full statement, remove it
              if (statementNode.parent && statementNode.parent.type === 'ExpressionStatement') {
                return fixer.remove(statementNode.parent);
              }

              // Otherwise just comment it out
              return fixer.replaceText(node, `/* console.${method} */`);
            },
          });
        }
      },
    };
  },
};
