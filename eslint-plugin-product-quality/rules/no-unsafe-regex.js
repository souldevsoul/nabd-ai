/**
 * ESLint Rule: no-unsafe-regex
 *
 * Detects potentially unsafe regular expressions that could cause ReDoS
 * (Regular Expression Denial of Service) attacks.
 *
 * Dangerous patterns:
 * - Nested quantifiers: (a+)+, (a*)*
 * - Overlapping alternations: (a|a)+
 * - Repeated groups with quantifiers: (.+)+
 *
 * OWASP: Denial of Service
 * CWE-1333: Inefficient Regular Expression Complexity
 *
 * @version 1.0.0
 * @category Security
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow potentially unsafe regular expressions (ReDoS)',
      category: 'Security',
      recommended: true,
    },
    messages: {
      unsafeRegex: 'Potentially unsafe regex pattern detected: "{{pattern}}". This may cause ReDoS (Regular Expression Denial of Service). Simplify the pattern.',
      nestedQuantifier: 'Nested quantifier detected in regex: "{{pattern}}". Patterns like (a+)+ can cause exponential backtracking.',
      dynamicRegex: 'Dynamic regex from user input detected. Validate and sanitize input before creating RegExp.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')) {
      return {};
    }

    // Patterns that indicate potential ReDoS
    // These are simplified checks - full ReDoS detection requires complex analysis
    const dangerousPatterns = [
      // Nested quantifiers: (a+)+, (a*)+, (a+)*, etc.
      /\([^)]*[+*]\)[+*]/,

      // Repeated capture groups with quantifiers
      /\([^)]*\)\{[0-9]+,\}/,

      // Multiple adjacent wildcards with quantifiers
      /\.\*\.\*/,
      /\.+\.+/,

      // Overlapping patterns (simplified check)
      /\([^|)]+\|[^|)]+\)\+/,

      // Character class with quantifier followed by similar pattern
      /\[[^\]]+\][+*]\[[^\]]+\][+*]/,
    ];

    // Additional string patterns to check
    const dangerousStringPatterns = [
      '(.*)*',
      '(.+)+',
      '(.?)+',
      '([a-zA-Z]+)*',
      '(a+)+',
      '(a*)*',
      '(a|aa)+',
      '(a|a?)+',
      '(.*a){10,}',
    ];

    function isUnsafeRegex(pattern) {
      if (typeof pattern !== 'string') return false;

      // Check against known dangerous patterns
      for (const dangerous of dangerousPatterns) {
        if (dangerous.test(pattern)) {
          return true;
        }
      }

      // Check against string patterns
      for (const dangerous of dangerousStringPatterns) {
        if (pattern.includes(dangerous)) {
          return true;
        }
      }

      // Check for nested quantifiers more thoroughly
      // Pattern: quantifier followed by group with quantifier
      const nestedQuantifierRegex = /[+*?]\s*\)|[+*?]\s*\{/;
      const groupWithQuantifier = /\([^)]+[+*?}\d]\)[+*?]/;

      if (groupWithQuantifier.test(pattern)) {
        return true;
      }

      return false;
    }

    function checkRegexLiteral(node, pattern) {
      if (isUnsafeRegex(pattern)) {
        // Determine which message to use
        const hasNestedQuantifier = /\([^)]*[+*]\)[+*]/.test(pattern) ||
                                    /\([^)]*\)\{[0-9]+,\}/.test(pattern);

        context.report({
          node,
          messageId: hasNestedQuantifier ? 'nestedQuantifier' : 'unsafeRegex',
          data: { pattern: pattern.substring(0, 50) + (pattern.length > 50 ? '...' : '') },
        });
      }
    }

    return {
      // Check regex literals: /pattern/
      Literal(node) {
        if (node.regex) {
          checkRegexLiteral(node, node.regex.pattern);
        }
      },

      // Check new RegExp() calls
      NewExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'RegExp'
        ) {
          const firstArg = node.arguments[0];

          // If first argument is a string literal, check it
          if (firstArg && firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
            checkRegexLiteral(node, firstArg.value);
          }

          // If first argument is a variable or expression (dynamic), warn
          if (firstArg && (
            firstArg.type === 'Identifier' ||
            firstArg.type === 'MemberExpression' ||
            firstArg.type === 'CallExpression' ||
            firstArg.type === 'BinaryExpression'
          )) {
            // Check if it's user input related
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText(firstArg);

            // Common patterns for user input
            const userInputPatterns = [
              /req\./,
              /request\./,
              /query\./,
              /params\./,
              /body\./,
              /input/i,
              /userInput/i,
              /searchTerm/i,
              /filter/i,
            ];

            for (const pattern of userInputPatterns) {
              if (pattern.test(text)) {
                context.report({
                  node,
                  messageId: 'dynamicRegex',
                });
                return;
              }
            }
          }
        }
      },

      // Check RegExp() calls (without new)
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'RegExp'
        ) {
          const firstArg = node.arguments[0];

          if (firstArg && firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
            checkRegexLiteral(node, firstArg.value);
          }
        }
      },
    };
  },
};
