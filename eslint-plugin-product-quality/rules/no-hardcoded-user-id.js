/**
 * ESLint Rule: no-hardcoded-user-id
 *
 * Detects hardcoded user IDs in API routes that should be obtained from session/auth.
 * This prevents authentication bypass bugs where temporary placeholder IDs are left
 * in production code.
 *
 * Common patterns detected:
 * - const userId = "temp-user-id"
 * - const userId = 'test-user'
 * - const userId = "placeholder"
 * - const userId = "user-123"
 * - const userId = "demo-user"
 *
 * @author Senior QA Engineer
 * @version 1.24.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded user IDs in API routes - must use session/auth',
      category: 'Security',
      recommended: true,
    },
    messages: {
      hardcodedUserId:
        'Hardcoded user ID "{{value}}" detected. Use session.user.id from auth() instead.',
      suspiciousUserId:
        'Suspicious hardcoded ID "{{value}}" in variable "{{variable}}". Consider using auth session.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only check API routes
    if (!filename.includes('/api/') && !filename.includes('\\api\\')) {
      return {};
    }

    // Skip auth-related files themselves
    if (filename.includes('/auth/') || filename.includes('\\auth\\')) {
      return {};
    }

    let hasAuthImport = false;
    let hasUserIdVariable = false;
    const userIdDeclarations = [];

    // Patterns for suspicious hardcoded user IDs
    const suspiciousPatterns = [
      /^temp[-_]?user/i,
      /^test[-_]?user/i,
      /^placeholder/i,
      /^demo[-_]?user/i,
      /^fake[-_]?user/i,
      /^mock[-_]?user/i,
      /^dummy[-_]?user/i,
      /^user[-_]?(id[-_]?)?\d+$/i,
      /^xxx+$/i,
      /^todo/i,
      /^fixme/i,
    ];

    return {
      ImportDeclaration(node) {
        // Check if auth is imported
        const source = node.source.value;
        if (source.includes('auth') || source.includes('next-auth')) {
          hasAuthImport = true;
        }
      },

      VariableDeclarator(node) {
        // Check for userId declarations
        if (node.id.type !== 'Identifier') return;

        const varName = node.id.name.toLowerCase();

        // Track any userId-like variable
        if (varName.includes('userid') || varName === 'uid' || varName === 'user_id') {
          hasUserIdVariable = true;

          // Check if initialized with a string literal
          if (node.init && node.init.type === 'Literal' && typeof node.init.value === 'string') {
            const value = node.init.value;

            // Check against suspicious patterns
            const isSuspicious = suspiciousPatterns.some((pattern) => pattern.test(value));

            if (isSuspicious) {
              context.report({
                node: node.init,
                messageId: 'hardcodedUserId',
                data: {
                  value: value,
                },
              });
            } else if (value.length > 0 && value.length < 50) {
              // Any hardcoded string for userId is suspicious
              userIdDeclarations.push({
                node: node.init,
                variable: node.id.name,
                value: value,
              });
            }
          }
        }
      },

      'Program:exit'() {
        // If userId is used but auth is not imported, that's suspicious
        if (hasUserIdVariable && !hasAuthImport) {
          // Report all userId declarations as potentially problematic
          userIdDeclarations.forEach((decl) => {
            context.report({
              node: decl.node,
              messageId: 'suspiciousUserId',
              data: {
                variable: decl.variable,
                value: decl.value,
              },
            });
          });
        }
      },
    };
  },
};
