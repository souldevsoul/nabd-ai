/**
 * @fileoverview Disallow console.log in production code
 * @author AutoQA
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow console.log and similar debugging statements in production',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noConsoleLog: 'Unexpected console.{{method}}() - use proper logging library or remove for production',
      noDebugger: 'Unexpected debugger statement - remove before deploying to production',
      noAlertPrompt: 'Unexpected {{method}}() - not suitable for production use',
    },
    schema: [{
      type: 'object',
      properties: {
        allow: {
          type: 'array',
          items: { type: 'string' },
          default: ['warn', 'error'],
        },
        allowInDev: {
          type: 'boolean',
          default: true,
        },
      },
      additionalProperties: false,
    }],
    fixable: 'code',
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedMethods = options.allow || ['warn', 'error'];
    const allowInDev = options.allowInDev !== false;

    const filename = context.getFilename();

    // Allow console in dev/test files
    if (allowInDev) {
      if (
        filename.includes('.test.') ||
        filename.includes('.spec.') ||
        filename.includes('/__tests__/') ||
        filename.includes('/scripts/') ||
        filename.includes('/config/')
      ) {
        return {};
      }
    }

    return {
      // Check for console.log, console.info, console.debug
      MemberExpression(node) {
        if (
          node.object.name === 'console' &&
          node.parent.type === 'CallExpression'
        ) {
          const method = node.property.name;

          // Allow console.warn and console.error by default
          if (allowedMethods.includes(method)) {
            return;
          }

          // Report other console methods
          if (['log', 'info', 'debug', 'trace', 'dir', 'table'].includes(method)) {
            context.report({
              node: node.parent,
              messageId: 'noConsoleLog',
              data: { method },
              fix(fixer) {
                // Auto-fix: remove the console statement
                return fixer.remove(node.parent.parent);
              },
            });
          }
        }
      },

      // Check for debugger statements
      DebuggerStatement(node) {
        context.report({
          node,
          messageId: 'noDebugger',
          fix(fixer) {
            return fixer.remove(node);
          },
        });
      },

      // Check for alert/prompt/confirm
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          ['alert', 'prompt', 'confirm'].includes(node.callee.name)
        ) {
          context.report({
            node,
            messageId: 'noAlertPrompt',
            data: { method: node.callee.name },
          });
        }
      },
    };
  },
};
