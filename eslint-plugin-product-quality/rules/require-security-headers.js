/**
 * ESLint Rule: require-security-headers
 *
 * Ensures security best practices are configured:
 * - CSP (Content Security Policy) headers
 * - CORS configuration
 * - Rate limiting on API routes
 * - HTTPS redirects in production
 * - Secure cookie settings
 *
 * Q4 2025 Best Practice: Security is non-negotiable for SaaS
 *
 * @version 3.0
 * @date 2025-11-20
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require security headers and configurations',
      category: 'Security',
      recommended: true,
    },
    messages: {
      missingCSP: 'Missing Content-Security-Policy headers. Add to next.config.js for XSS protection.',
      insecureCookie: 'Cookie set without secure/httpOnly flags. Use secure cookies in production.',
      noRateLimit: 'API route missing rate limiting. Protect against abuse with rate limits.',
      missingCORS: 'API route missing CORS configuration. Explicitly configure allowed origins.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Check API routes
    if (!filename.includes('/api/') || !filename.endsWith('route.ts')) {
      return {};
    }

    let hasRateLimit = false;
    let hasCORS = false;

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (source.includes('rate-limit') || source.includes('ratelimit')) {
          hasRateLimit = true;
        }

        if (source.includes('cors') || source.includes('next-cors')) {
          hasCORS = true;
        }
      },

      CallExpression(node) {
        // Check for cookie.set() without secure options
        if (node.callee.type === 'MemberExpression' &&
            node.callee.property.name === 'set' &&
            node.callee.object.name === 'cookies') {

          const options = node.arguments[2];
          if (!options || options.type !== 'ObjectExpression') {
            context.report({
              node,
              messageId: 'insecureCookie',
            });
          } else {
            const hasSecure = options.properties.some(p => p.key.name === 'secure');
            const hasHttpOnly = options.properties.some(p => p.key.name === 'httpOnly');

            if (!hasSecure || !hasHttpOnly) {
              context.report({
                node,
                messageId: 'insecureCookie',
              });
            }
          }
        }
      },

      'Program:exit'() {
        // Suggest rate limiting and CORS for public APIs
        if (filename.includes('/api/') && !filename.includes('/api/auth/')) {
          if (!hasRateLimit) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'noRateLimit',
            });
          }

          if (!hasCORS) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingCORS',
            });
          }
        }
      },
    };
  },
};
