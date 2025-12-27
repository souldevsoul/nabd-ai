/**
 * ESLint Rule: require-navigation-in-header
 *
 * Ensures header components include navigation links.
 * Marketing headers should have navigation; dashboard headers can be minimal.
 *
 * DETECTS:
 * - Header components without navigation links
 * - Headers with only logo and buttons (missing nav)
 *
 * ALLOWS:
 * - Marketing headers with <nav>, navLinks prop, or Link components
 * - Dashboard/app headers (excluded by default)
 *
 * @date 2025-11-19
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure headers include navigation links',
      category: 'UX Consistency',
    },
    messages: {
      missingNavigation: 'Header component should include navigation links. Add navLinks prop or <nav> with Link components.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          excludePaths: {
            type: 'array',
            items: { type: 'string' },
            default: ['/app/', '/dashboard/', '/(auth)/'],
          },
          requireMinLinks: {
            type: 'number',
            default: 3,
          },
        },
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const excludePaths = options.excludePaths || ['/app/', '/dashboard/', '/(auth)/'];
    const filename = context.getFilename();

    // Check if file should be excluded
    const isExcluded = excludePaths.some(pattern => {
      return filename.includes(pattern);
    });

    if (isExcluded) {
      return {};
    }

    // Only check header component files
    const isHeaderFile = filename.toLowerCase().includes('header') ||
                        filename.toLowerCase().includes('navbar') ||
                        filename.toLowerCase().includes('navigation');

    if (!isHeaderFile) {
      return {};
    }

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.')) {
      return {};
    }

    let hasNavLinksInterface = false;
    let hasNavLinksProp = false;
    let hasNavElement = false;
    let hasMultipleLinks = false;
    let linkCount = 0;

    return {
      // Check for NavLink interface definition
      TSInterfaceDeclaration(node) {
        if (node.id.name === 'NavLink' || node.id.name === 'NavigationLink') {
          hasNavLinksInterface = true;
        }
      },

      // Check for navLinks prop in component definition
      Identifier(node) {
        if (node.name === 'navLinks' || node.name === 'navigationLinks') {
          const parent = node.parent;

          // Check if it's a prop destructuring
          if (parent && parent.type === 'Property' && parent.key === node) {
            hasNavLinksProp = true;
          }
        }
      },

      // Check for <nav> element
      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        if (elementName === 'nav') {
          hasNavElement = true;
        }

        // Count Link components
        if (elementName === 'Link' || elementName === 'a') {
          linkCount++;
        }
      },

      'Program:exit'() {
        // Check if there are multiple links
        if (linkCount >= 3) {
          hasMultipleLinks = true;
        }

        // Header should have navigation evidence
        const hasNavigation = hasNavLinksInterface ||
                             hasNavLinksProp ||
                             (hasNavElement && hasMultipleLinks);

        if (!hasNavigation) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingNavigation',
          });
        }
      },
    };
  },
};
