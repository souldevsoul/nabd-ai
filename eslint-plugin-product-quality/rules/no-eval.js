/**
 * ESLint Rule: no-eval
 *
 * Detects usage of eval() and similar dangerous functions.
 * eval() allows execution of arbitrary code and is a major security risk.
 *
 * Detected patterns:
 * - eval(string)
 * - new Function(string)
 * - setTimeout(string, ...) - string form
 * - setInterval(string, ...) - string form
 *
 * OWASP: Injection (A03:2021)
 *
 * @version 1.0.0
 * @category Security
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow eval() and similar dangerous functions',
      category: 'Security',
      recommended: true,
    },
    messages: {
      noEval: 'eval() is dangerous and allows arbitrary code execution. Refactor to avoid eval().',
      noFunctionConstructor: 'new Function() is equivalent to eval() and is dangerous. Use a regular function instead.',
      noImpliedEval: '{{name}}() with a string argument is equivalent to eval(). Pass a function instead.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')) {
      return {};
    }

    return {
      // Direct eval() call
      CallExpression(node) {
        // Check for eval()
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'eval'
        ) {
          context.report({
            node,
            messageId: 'noEval',
          });
          return;
        }

        // Check for setTimeout/setInterval with string argument
        if (
          node.callee.type === 'Identifier' &&
          (node.callee.name === 'setTimeout' || node.callee.name === 'setInterval')
        ) {
          const firstArg = node.arguments[0];
          if (firstArg && firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
            context.report({
              node,
              messageId: 'noImpliedEval',
              data: { name: node.callee.name },
            });
          }
          // Also check template literals
          if (firstArg && firstArg.type === 'TemplateLiteral') {
            context.report({
              node,
              messageId: 'noImpliedEval',
              data: { name: node.callee.name },
            });
          }
        }

        // Check for window.eval, global.eval, globalThis.eval
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'eval'
        ) {
          const objectName = node.callee.object.type === 'Identifier'
            ? node.callee.object.name
            : null;

          if (objectName === 'window' || objectName === 'global' || objectName === 'globalThis') {
            context.report({
              node,
              messageId: 'noEval',
            });
          }
        }

        // Check for window.setTimeout/setInterval with string
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          (node.callee.property.name === 'setTimeout' || node.callee.property.name === 'setInterval')
        ) {
          const firstArg = node.arguments[0];
          if (firstArg && firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
            context.report({
              node,
              messageId: 'noImpliedEval',
              data: { name: node.callee.property.name },
            });
          }
        }
      },

      // new Function()
      NewExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Function'
        ) {
          context.report({
            node,
            messageId: 'noFunctionConstructor',
          });
        }
      },
    };
  },
};
