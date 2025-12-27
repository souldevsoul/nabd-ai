/**
 * ESLint Rule: no-alert-calls
 *
 * Disallows the use of alert(), confirm(), and prompt() in production code.
 * These native browser dialogs:
 * - Block the main thread
 * - Cannot be styled to match the application design
 * - Provide poor user experience
 * - Are not accessible
 *
 * Instead, use a toast notification system (react-hot-toast, sonner, etc.)
 * or custom modal dialogs.
 *
 * @author Senior QA Engineer
 * @version 1.25.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow alert(), confirm(), and prompt() - use toast notifications instead',
      category: 'UX',
      recommended: true,
    },
    messages: {
      noAlert:
        'Avoid using alert() - it blocks the UI and provides poor UX. Use a toast notification system (react-hot-toast, sonner) or custom modal instead.',
      noConfirm:
        'Avoid using confirm() - it blocks the UI and cannot be styled. Use a custom confirmation dialog component instead.',
      noPrompt:
        'Avoid using prompt() - it blocks the UI and cannot be styled. Use a custom input dialog component instead.',
      noWindowAlert:
        'Avoid using window.alert() - it blocks the UI and provides poor UX. Use a toast notification system instead.',
      noWindowConfirm:
        'Avoid using window.confirm() - it blocks the UI. Use a custom confirmation dialog instead.',
      noWindowPrompt:
        'Avoid using window.prompt() - it blocks the UI. Use a custom input dialog instead.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInTests: {
            type: 'boolean',
            description: 'Allow alert/confirm/prompt in test files',
          },
        },
      },
    ],
    fixable: 'code',
  },

  create(context) {
    const options = context.options[0] || {};
    const allowInTests = options.allowInTests || false;
    const filename = context.getFilename();

    // Skip test files if configured
    if (allowInTests) {
      if (
        filename.includes('.test.') ||
        filename.includes('.spec.') ||
        filename.includes('__tests__') ||
        filename.includes('/__mocks__/')
      ) {
        return {};
      }
    }

    // Map of function names to their message IDs
    const directFunctions = {
      alert: 'noAlert',
      confirm: 'noConfirm',
      prompt: 'noPrompt',
    };

    const windowFunctions = {
      alert: 'noWindowAlert',
      confirm: 'noWindowConfirm',
      prompt: 'noWindowPrompt',
    };

    return {
      CallExpression(node) {
        // Check for direct calls: alert(), confirm(), prompt()
        if (node.callee.type === 'Identifier') {
          const funcName = node.callee.name;
          if (directFunctions[funcName]) {
            context.report({
              node,
              messageId: directFunctions[funcName],
              fix(fixer) {
                // Auto-fix: replace with console.warn TODO comment
                const sourceCode = context.getSourceCode();
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(
                  node,
                  `console.warn("TODO: Replace ${funcName}() with toast - was: ${nodeText.replace(/"/g, "'")}")`
                );
              },
            });
          }
        }

        // Check for window.alert(), window.confirm(), window.prompt()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'window' &&
          node.callee.property.type === 'Identifier'
        ) {
          const funcName = node.callee.property.name;
          if (windowFunctions[funcName]) {
            context.report({
              node,
              messageId: windowFunctions[funcName],
              fix(fixer) {
                // Auto-fix: replace with console.warn TODO comment
                const sourceCode = context.getSourceCode();
                const nodeText = sourceCode.getText(node);
                return fixer.replaceText(
                  node,
                  `console.warn("TODO: Replace window.${funcName}() with toast - was: ${nodeText.replace(/"/g, "'")}")`
                );
              },
            });
          }
        }
      },
    };
  },
};
