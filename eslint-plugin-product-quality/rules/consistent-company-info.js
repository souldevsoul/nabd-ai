/**
 * ESLint Rule: consistent-company-info
 *
 * Ensures company information (name, email) is consistent throughout the codebase.
 * Detects wrong company names in text content (copy-paste errors from templates).
 *
 * @version 1.3.1
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure company information (name, email) is consistent',
      category: 'Content Consistency',
      recommended: true,
    },
    messages: {
      inconsistentEmail: 'Email "{{found}}" doesn\'t match configured email "{{configured}}"',
      wrongCompanyName: 'Found "{{found}}" but expected "{{configured}}". This looks like a copy-paste error from template.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          companyName: { type: 'string' },
          email: { type: 'string' },
        },
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const configuredName = options.companyName;

    // Common template/competitor names to check against
    const KNOWN_PRODUCT_NAMES = [
      'VoiceCraft', 'PropVideo', 'TutorBot', 'Toonify', 'BookTrailer',
      'ClipMaster', 'LogoSmith', 'PetPortrait', 'FashionForge', 'Coursify',
      'CodeCraft', 'FlowMatic', 'ReelMatic', 'DataScope', 'FormPilot', 'CopyRefine',
    ];

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;
        const text = node.value;

        // Check email consistency
        if (options.email) {
          const emailMatch = text.match(/\b[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
          if (emailMatch && emailMatch[0] !== options.email && !emailMatch[0].includes('example.com')) {
            context.report({
              node,
              messageId: 'inconsistentEmail',
              data: {
                found: emailMatch[0],
                configured: options.email,
              },
            });
          }
        }

        // Check company name consistency
        if (configuredName) {
          // Remove spaces and convert to lowercase for comparison
          const normalizedConfigured = configuredName.replace(/\s+/g, '').toLowerCase();

          for (const productName of KNOWN_PRODUCT_NAMES) {
            const normalizedProduct = productName.replace(/\s+/g, '').toLowerCase();

            // Skip if this is the configured name
            if (normalizedProduct === normalizedConfigured) continue;

            // Skip if configured name CONTAINS the product name (e.g., "PETPORTRAIT.AI" contains "petportrait")
            if (normalizedConfigured.includes(normalizedProduct)) continue;

            // Check if text contains wrong product name
            // Use word boundaries to avoid false positives
            const regex = new RegExp(`\\b${productName}\\b`, 'i');
            if (regex.test(text)) {
              context.report({
                node,
                messageId: 'wrongCompanyName',
                data: {
                  found: productName,
                  configured: configuredName,
                },
              });
              break; // Report only first occurrence per string
            }
          }
        }
      },

      // Check JSX text content
      JSXText(node) {
        if (!configuredName) return;
        const text = node.value.trim();
        if (!text) return;

        const normalizedConfigured = configuredName.replace(/\s+/g, '').toLowerCase();

        for (const productName of KNOWN_PRODUCT_NAMES) {
          const normalizedProduct = productName.replace(/\s+/g, '').toLowerCase();

          if (normalizedProduct === normalizedConfigured) continue;

          // Skip if configured name CONTAINS the product name (e.g., "PETPORTRAIT.AI" contains "petportrait")
          if (normalizedConfigured.includes(normalizedProduct)) continue;

          const regex = new RegExp(`\\b${productName}\\b`, 'i');
          if (regex.test(text)) {
            context.report({
              node,
              messageId: 'wrongCompanyName',
              data: {
                found: productName,
                configured: configuredName,
              },
            });
            break;
          }
        }
      },
    };
  },
};
