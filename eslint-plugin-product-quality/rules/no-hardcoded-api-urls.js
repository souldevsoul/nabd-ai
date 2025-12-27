/**
 * ESLint Rule: no-hardcoded-api-urls
 *
 * API URLs must use environment variables, not hardcoded strings.
 * This prevents issues when deploying to different environments.
 *
 * @version 1.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'API URLs must use environment variables, not hardcoded strings',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      hardcodedApiUrl: 'Hardcoded API URL detected: "{{url}}". Use environment variables (process.env.NEXT_PUBLIC_APP_URL or similar).',
      hardcodedLocalhost: 'Hardcoded localhost URL detected: "{{url}}". Use environment variables for API URLs.',
      suspiciousUrl: 'Suspicious hardcoded URL detected: "{{url}}". Consider using environment variables.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedDomains: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
          allowedPatterns: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const allowedDomains = options.allowedDomains || [];
    const allowedPatterns = options.allowedPatterns || [];

    // Common API URL patterns
    const apiUrlPatterns = [
      /^https?:\/\/localhost:\d+/,
      /^https?:\/\/127\.0\.0\.1:\d+/,
      /^https?:\/\/[^/]*\.local(:\d+)?/,
      /^https?:\/\/[^/]*\.(dev|test|staging|prod)\./,
      /\/api\//,
    ];

    // External services that might be legitimate (CDNs, etc.)
    const legitimateServices = [
      'replicate.com',
      'vercel.app',
      'blob.vercel-storage.com',
      'stripe.com',
      'github.com',
      'googleapis.com',
      'cloudinary.com',
      'amazonaws.com',
      's3.amazonaws.com',
      'firebase.com',
      'firebaseio.com',
      'schema.org', // Standard JSON-LD vocabulary URL
      'w3.org', // W3C standards
      'purl.org', // Persistent URLs
      'policies.google.com', // Google policy links
      'toonify.ai', // Site's own domain (canonical URLs, sitemap, robots)
      'toonify.app', // Site's own domain alternate
    ];

    function isAllowedUrl(url) {
      // Check if URL matches allowed domains
      if (allowedDomains.some(domain => url.includes(domain))) {
        return true;
      }

      // Check if URL matches allowed patterns
      if (allowedPatterns.some(pattern => new RegExp(pattern).test(url))) {
        return true;
      }

      // Check if it's a legitimate external service
      if (legitimateServices.some(service => url.includes(service))) {
        return true;
      }

      // Allow relative URLs
      if (url.startsWith('/') && !url.startsWith('//')) {
        return true;
      }

      return false;
    }

    function isApiUrl(url) {
      return apiUrlPatterns.some(pattern => pattern.test(url));
    }

    function checkStringForUrls(node, value) {
      if (typeof value !== 'string') return;

      // Skip if it's clearly not a URL
      if (!value.includes('http') && !value.includes('localhost') && !value.includes('/api/')) {
        return;
      }

      // Skip if it's allowed
      if (isAllowedUrl(value)) {
        return;
      }

      // Check for localhost
      if (value.includes('localhost') || value.includes('127.0.0.1')) {
        context.report({
          node,
          messageId: 'hardcodedLocalhost',
          data: { url: value },
        });
        return;
      }

      // Check for API URLs
      if (isApiUrl(value)) {
        context.report({
          node,
          messageId: 'hardcodedApiUrl',
          data: { url: value },
        });
        return;
      }

      // Check for suspicious URLs (contains http/https but not in allowed list)
      if (value.match(/^https?:\/\//)) {
        context.report({
          node,
          messageId: 'suspiciousUrl',
          data: { url: value },
        });
      }
    }

    return {
      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkStringForUrls(node, node.value);
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        const sourceCode = context.getSourceCode();
        const templateValue = sourceCode.getText(node);

        // Simple check for template literals without complex expressions
        if (node.expressions.length === 0) {
          const value = node.quasis[0].value.cooked;
          checkStringForUrls(node, value);
        } else {
          // For template literals with expressions, check if it looks like a URL
          const fullText = sourceCode.getText(node);
          if (fullText.includes('http') || fullText.includes('localhost')) {
            // Extract the static parts
            node.quasis.forEach(quasi => {
              if (quasi.value.cooked) {
                checkStringForUrls(node, quasi.value.cooked);
              }
            });
          }
        }
      },

      // Check fetch calls
      'CallExpression[callee.name="fetch"]'(node) {
        if (node.arguments.length > 0) {
          const firstArg = node.arguments[0];
          if (firstArg.type === 'Literal') {
            checkStringForUrls(firstArg, firstArg.value);
          } else if (firstArg.type === 'TemplateLiteral') {
            // Already handled by TemplateLiteral visitor
          }
        }
      },

      // Check axios calls
      'CallExpression[callee.object.name="axios"]'(node) {
        if (node.arguments.length > 0) {
          const firstArg = node.arguments[0];
          if (firstArg.type === 'Literal') {
            checkStringForUrls(firstArg, firstArg.value);
          }
        }
      },
    };
  },
};
