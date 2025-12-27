/**
 * ESLint Rule: email-must-match-domain
 * 
 * Email addresses must use the project domain.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Email addresses must use the project domain',
      category: 'Content Restrictions',
      recommended: true,
    },
    messages: {
      wrongEmailDomain: 'Email "{{email}}" uses wrong domain. All emails must be from {{expectedDomain}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          domain: { type: 'string' },
        },
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const expectedDomain = options.domain;

    if (!expectedDomain) {
      return {};
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          // Extract email addresses from the string
          const emailRegex = /\b[\w.%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})\b/gi;
          const matches = [...node.value.matchAll(emailRegex)];

          matches.forEach((match) => {
            const email = match[0];
            const domain = match[1].toLowerCase();

            // Skip example.com and common test domains
            if (domain === 'example.com' || domain === 'test.com' || domain === 'localhost') {
              return;
            }

            // Check if email matches expected domain
            if (domain !== expectedDomain.toLowerCase()) {
              context.report({
                node,
                messageId: 'wrongEmailDomain',
                data: {
                  email,
                  expectedDomain,
                },
              });
            }
          });
        }
      },
    };
  },
};
