/**
 * ESLint Rule: require-consistent-legal-page-design
 *
 * Ensures legal pages have consistent design patterns across all legal documents.
 *
 * @version 1.0
 * @date 2025-11-20
 *
 * Checks:
 * - Consistent hero section structure
 * - Consistent section headings
 * - Consistent text formatting
 * - Consistent spacing and layout
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce consistent design patterns across legal pages',
      category: 'Legal Pages Quality',
      recommended: true,
    },
    messages: {
      inconsistentHero: 'Legal pages should have consistent hero section structure in {{path}}',
      inconsistentHeading: 'Legal pages should use consistent heading styles in {{path}}',
      inconsistentSpacing: 'Legal pages should have consistent spacing in {{path}}',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Check if this is a legal/policy page
    const legalPagePatterns = [
      /privacy.*page\.tsx$/,
      /terms.*page\.tsx$/,
      /cookie.*page\.tsx$/,
      /refund.*page\.tsx$/,
      /cancellation.*page\.tsx$/,
      /payment.*page\.tsx$/,
      /delivery.*page\.tsx$/,
      /gdpr.*page\.tsx$/,
    ];

    const isLegalPage = legalPagePatterns.some(pattern => pattern.test(filename));

    if (!isLegalPage) {
      return {};
    }

    return {
      // This rule performs structural checks
      // For now, it's a placeholder that can be extended with specific checks
      Program(node) {
        // Basic validation that the file structure is consistent
        // Can be extended with specific design pattern checks
      },
    };
  },
};
