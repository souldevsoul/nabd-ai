/**
 * ESLint Rule: require-unique-page-titles
 *
 * All pages must have unique title tags for SEO.
 * Duplicate titles harm search rankings and user experience.
 *
 * @version 1.0
 */

const path = require('path');
const fs = require('fs');

// Global store for all page titles across the project
const pageTitles = new Map();

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'All pages must have unique title tags for SEO',
      category: 'SEO',
      recommended: true,
    },
    messages: {
      duplicateTitle: 'Duplicate page title "{{title}}" already used in {{otherFile}}. Each page must have a unique title for SEO.',
      missingTitle: 'Page missing title tag. Add <title> or set metadata.title for SEO.',
      genericTitle: 'Generic title "{{title}}" detected. Use specific, descriptive titles for better SEO.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();

    // Only check page files (Next.js pages)
    if (!filename.includes('/app/') && !filename.includes('/pages/')) {
      return {};
    }

    // Skip non-page files
    if (filename.includes('/components/') ||
        filename.includes('/lib/') ||
        filename.includes('/api/') ||
        filename.includes('/_') ||
        filename.includes('/layout.') ||
        filename.includes('/loading.') ||
        filename.includes('/error.')) {
      return {};
    }

    const genericTitles = [
      'Home',
      'Page',
      'Welcome',
      'Index',
      'Main',
      'Untitled',
      'New Page',
      'Default',
    ];

    return {
      // Check for <title> in JSX
      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        if (elementName === 'title') {
          const titleContent = node.children.find(child => child.type === 'JSXText');
          if (titleContent) {
            const title = titleContent.value.trim();

            // Check for generic titles
            if (genericTitles.includes(title)) {
              context.report({
                node,
                messageId: 'genericTitle',
                data: { title },
              });
              return;
            }

            // Check for duplicates
            if (pageTitles.has(title)) {
              const otherFile = pageTitles.get(title);
              if (otherFile !== filename) {
                context.report({
                  node,
                  messageId: 'duplicateTitle',
                  data: {
                    title,
                    otherFile: path.relative(process.cwd(), otherFile),
                  },
                });
              }
            } else {
              pageTitles.set(title, filename);
            }
          }
        }
      },

      // Check metadata exports (Next.js 13+ App Router)
      ExportNamedDeclaration(node) {
        if (node.declaration?.type === 'VariableDeclaration') {
          const metadataDeclaration = node.declaration.declarations.find(
            decl => decl.id.name === 'metadata'
          );

          if (metadataDeclaration && metadataDeclaration.init?.type === 'ObjectExpression') {
            const titleProperty = metadataDeclaration.init.properties.find(
              prop => prop.key?.name === 'title'
            );

            if (titleProperty && titleProperty.value?.type === 'Literal') {
              const title = titleProperty.value.value;

              // Check for generic titles
              if (genericTitles.includes(title)) {
                context.report({
                  node: titleProperty,
                  messageId: 'genericTitle',
                  data: { title },
                });
                return;
              }

              // Check for duplicates
              if (pageTitles.has(title)) {
                const otherFile = pageTitles.get(title);
                if (otherFile !== filename) {
                  context.report({
                    node: titleProperty,
                    messageId: 'duplicateTitle',
                    data: {
                      title,
                      otherFile: path.relative(process.cwd(), otherFile),
                    },
                  });
                }
              } else {
                pageTitles.set(title, filename);
              }
            }
          }
        }
      },

      // Check for Head component with title (Next.js Pages Router)
      'JSXElement[openingElement.name.name="Head"]'(node) {
        const titleElement = node.children.find(
          child => child.type === 'JSXElement' &&
                   child.openingElement.name.name === 'title'
        );

        if (!titleElement) {
          context.report({
            node,
            messageId: 'missingTitle',
          });
        }
      },
    };
  },
};
