/**
 * ESLint Rule: require-consistent-layout
 *
 * Ensures all pages have consistent header and footer layout
 *
 * @author Senior QA Engineer
 * @date 2025-11-18
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure all pages have consistent header and footer',
      category: 'UX Consistency',
      recommended: true,
    },
    messages: {
      missingHeader: 'Page missing header component. All pages must have a consistent header.',
      missingFooter: 'Page missing footer component. All pages must have a consistent footer.',
      inconsistentHeaderImport: 'Header imported from "{{found}}" but should be from "{{expected}}"',
      inconsistentFooterImport: 'Footer imported from "{{found}}" but should be from "{{expected}}"',
      headerNotRendered: 'Header component imported but not rendered in JSX',
      footerNotRendered: 'Footer component imported but not rendered in JSX',
    },
    schema: [
      {
        type: 'object',
        properties: {
          headerComponent: {
            type: 'string',
            default: 'Header',
          },
          footerComponent: {
            type: 'string',
            default: 'Footer',
          },
          headerImportPath: {
            type: 'string',
            default: '@/components/Header',
          },
          footerImportPath: {
            type: 'string',
            default: '@/components/Footer',
          },
          excludePatterns: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
          requireHeader: {
            type: 'boolean',
            default: true,
          },
          requireFooter: {
            type: 'boolean',
            default: true,
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const headerComponent = options.headerComponent || 'Header';
    const footerComponent = options.footerComponent || 'Footer';
    const headerImportPath = options.headerImportPath || '@/components/Header';
    const footerImportPath = options.footerImportPath || '@/components/Footer';
    const excludePatterns = options.excludePatterns || [
      '/api/',
      '/dashboard/',
      '/(auth)/',
      '.test.',
      '.spec.',
    ];
    const requireHeader = options.requireHeader !== false;
    const requireFooter = options.requireFooter !== false;

    const filename = context.getFilename();

    // Check if file should be excluded
    const isExcluded = excludePatterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(filename);
    });

    if (isExcluded) {
      return {};
    }

    // Only check page files (page.tsx, page.jsx)
    if (!filename.includes('page.tsx') && !filename.includes('page.jsx')) {
      return {};
    }

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.')) {
      return {};
    }

    let hasHeaderImport = false;
    let hasFooterImport = false;
    let headerImportSource = null;
    let footerImportSource = null;
    let hasHeaderInJSX = false;
    let hasFooterInJSX = false;

    // Helper function to check if component name matches header patterns
    const isHeaderComponent = (name) => {
      if (!name) return false;
      const lowerName = name.toLowerCase();
      return (
        name === headerComponent ||
        lowerName.includes('navbar') ||
        lowerName.includes('header') ||
        lowerName.includes('navigation')
      );
    };

    // Helper function to check if component name matches footer patterns
    const isFooterComponent = (name) => {
      if (!name) return false;
      const lowerName = name.toLowerCase();
      return (
        name === footerComponent ||
        lowerName.includes('footer')
      );
    };

    // Helper function to check if import path is valid for header/footer
    const isValidHeaderPath = (path) => {
      const lowerPath = path.toLowerCase();
      return (
        lowerPath.includes('/header') ||
        lowerPath.includes('/navbar') ||
        lowerPath.includes('/navigation') ||
        lowerPath.includes('/layout/header') ||
        lowerPath.includes('/marketing/layout/header')
      );
    };

    const isValidFooterPath = (path) => {
      const lowerPath = path.toLowerCase();
      return (
        lowerPath.includes('/footer') ||
        lowerPath.includes('/layout/footer') ||
        lowerPath.includes('/marketing/layout/footer')
      );
    };

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        // Check for Header import
        node.specifiers.forEach(specifier => {
          if (specifier.type === 'ImportDefaultSpecifier' ||
              specifier.type === 'ImportSpecifier') {
            const importedName = specifier.imported?.name || specifier.local.name;

            if (isHeaderComponent(importedName)) {
              hasHeaderImport = true;
              headerImportSource = importSource;

              // Check if import is from valid path (more flexible now)
              if (!isValidHeaderPath(importSource)) {
                context.report({
                  node,
                  messageId: 'inconsistentHeaderImport',
                  data: {
                    found: importSource,
                    expected: headerImportPath,
                  },
                });
              }
            }

            if (isFooterComponent(importedName)) {
              hasFooterImport = true;
              footerImportSource = importSource;

              // Check if import is from valid path (more flexible now)
              if (!isValidFooterPath(importSource)) {
                context.report({
                  node,
                  messageId: 'inconsistentFooterImport',
                  data: {
                    found: importSource,
                    expected: footerImportPath,
                  },
                });
              }
            }
          }
        });
      },

      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        if (isHeaderComponent(elementName) || elementName === 'header') {
          hasHeaderInJSX = true;
        }

        if (isFooterComponent(elementName) || elementName === 'footer') {
          hasFooterInJSX = true;
        }
      },

      'Program:exit'() {
        // Check for missing header
        if (requireHeader && !hasHeaderImport) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingHeader',
          });
        }

        // Check for missing footer
        if (requireFooter && !hasFooterImport) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingFooter',
          });
        }

        // Check if imported but not rendered
        if (hasHeaderImport && !hasHeaderInJSX) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'headerNotRendered',
          });
        }

        if (hasFooterImport && !hasFooterInJSX) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'footerNotRendered',
          });
        }
      },
    };
  },
};
