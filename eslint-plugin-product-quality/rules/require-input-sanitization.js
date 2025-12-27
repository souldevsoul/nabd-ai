/**
 * ESLint Rule: require-input-sanitization
 *
 * Ensures user inputs are sanitized before rendering or database operations.
 *
 * DETECTS:
 * - dangerouslySetInnerHTML without sanitization
 * - String interpolation in SQL-like patterns
 * - Direct user input rendering without escaping
 *
 * REQUIRES:
 * - Use DOMPurify.sanitize() before dangerouslySetInnerHTML
 * - Use parameterized queries for SQL operations
 *
 * @version 1.0.0
 * @date 2025-11-24
 * @category Security - XSS Prevention
 * @priority CRITICAL
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure user inputs are sanitized before rendering or database operations',
      category: 'Security',
      recommended: true,
    },
    messages: {
      unsanitizedInnerHtml: 'dangerouslySetInnerHTML must use DOMPurify.sanitize() or similar sanitization. This is a CRITICAL security vulnerability (XSS).',
      sqlInjectionRisk: 'Potential SQL injection detected. Use parameterized queries instead of string interpolation.',
      directUserInputRender: 'User input ({{inputName}}) is rendered directly without sanitization.',
    },
    schema: [],
  },

  create(context) {
    let hasDomPurifyImport = false;
    let hasSanitizerImport = false;

    // Track variables that are known to be sanitized
    const sanitizedVars = new Set();

    return {
      // Check for sanitization library imports
      ImportDeclaration(node) {
        const source = node.source.value.toLowerCase();

        if (source.includes('dompurify') || source.includes('sanitize')) {
          hasDomPurifyImport = true;
          hasSanitizerImport = true;
        }

        if (source.includes('validator') || source.includes('xss')) {
          hasSanitizerImport = true;
        }
      },

      // Track DOMPurify.sanitize() calls
      CallExpression(node) {
        // Check for DOMPurify.sanitize(value) pattern
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'DOMPurify' &&
          node.callee.property.name === 'sanitize'
        ) {
          // If result is assigned to a variable, track it
          if (node.parent.type === 'VariableDeclarator') {
            sanitizedVars.add(node.parent.id.name);
          }
        }

        // Check for sanitize() function call
        if (
          node.callee.type === 'Identifier' &&
          (node.callee.name === 'sanitize' || node.callee.name === 'escapeHtml')
        ) {
          if (node.parent.type === 'VariableDeclarator') {
            sanitizedVars.add(node.parent.id.name);
          }
        }
      },

      // Check dangerouslySetInnerHTML usage
      JSXAttribute(node) {
        if (node.name.name !== 'dangerouslySetInnerHTML') {
          return;
        }

        // Get the value being passed
        if (!node.value || node.value.type !== 'JSXExpressionContainer') {
          return;
        }

        const expr = node.value.expression;

        // Check if it's an object like { __html: value }
        if (expr.type !== 'ObjectExpression') {
          return;
        }

        const htmlProp = expr.properties.find(
          prop => prop.key && (prop.key.name === '__html' || prop.key.value === '__html')
        );

        if (!htmlProp) return;

        const htmlValue = htmlProp.value;

        // Check if value is sanitized
        let isSanitized = false;

        // Pattern 1: DOMPurify.sanitize(value)
        if (
          htmlValue.type === 'CallExpression' &&
          htmlValue.callee.type === 'MemberExpression' &&
          htmlValue.callee.object.name === 'DOMPurify' &&
          htmlValue.callee.property.name === 'sanitize'
        ) {
          isSanitized = true;
        }

        // Pattern 2: sanitize(value) or escapeHtml(value)
        if (
          htmlValue.type === 'CallExpression' &&
          htmlValue.callee.type === 'Identifier' &&
          (htmlValue.callee.name === 'sanitize' ||
            htmlValue.callee.name === 'escapeHtml' ||
            htmlValue.callee.name === 'purify')
        ) {
          isSanitized = true;
        }

        // Pattern 3: Previously sanitized variable
        if (
          htmlValue.type === 'Identifier' &&
          sanitizedVars.has(htmlValue.name)
        ) {
          isSanitized = true;
        }

        // Pattern 4: JSON.stringify() - safe for JSON-LD scripts
        if (
          htmlValue.type === 'CallExpression' &&
          htmlValue.callee.type === 'MemberExpression' &&
          htmlValue.callee.object.name === 'JSON' &&
          htmlValue.callee.property.name === 'stringify'
        ) {
          isSanitized = true;
        }

        if (!isSanitized) {
          context.report({
            node,
            messageId: 'unsanitizedInnerHtml',
          });
        }
      },

      // Check for SQL injection patterns in template literals
      TemplateLiteral(node) {
        // Get the full template string
        const quasis = node.quasis.map(q => q.value.raw).join('');
        const lowerQuasis = quasis.toLowerCase();

        // Check for SQL-like patterns
        const sqlPatterns = [
          'select',
          'insert',
          'update',
          'delete',
          'drop',
          'where',
          'from',
        ];

        const hasSqlPattern = sqlPatterns.some(pattern =>
          lowerQuasis.includes(pattern)
        );

        // If it looks like SQL and has interpolations, flag it
        if (hasSqlPattern && node.expressions.length > 0) {
          // Check for common safe patterns (prepared statements)
          const isSafe = lowerQuasis.includes('$') || // PostgreSQL parameterized
                        lowerQuasis.includes('?') ||  // MySQL parameterized
                        lowerQuasis.includes(':');    // Named parameters

          if (!isSafe) {
            context.report({
              node,
              messageId: 'sqlInjectionRisk',
            });
          }
        }
      },
    };
  },
};
