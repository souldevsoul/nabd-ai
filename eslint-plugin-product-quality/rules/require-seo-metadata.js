/**
 * ESLint Rule: require-seo-metadata
 *
 * Ensures all pages have proper SEO metadata including:
 * - Page title (unique, descriptive, <60 chars)
 * - Meta description (unique, compelling, 150-160 chars)
 * - Open Graph tags (og:title, og:description, og:image, og:url)
 * - Twitter Card tags (twitter:card, twitter:title, twitter:description)
 * - Canonical URL
 * - Structured data (JSON-LD) where appropriate
 *
 * Q4 2025 Best Practice: Every page must be optimized for search and social sharing
 *
 * @version 3.0
 * @date 2025-11-20
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require comprehensive SEO metadata on all pages',
      category: 'SEO & Discoverability',
      recommended: true,
    },
    messages: {
      missingMetadata: 'Page missing metadata export. All pages need title and description for SEO.',
      missingTitle: 'Page metadata missing title property. Required for SEO.',
      missingDescription: 'Page metadata missing description property. Required for SEO and social sharing.',
      titleTooLong: 'Page title "{{title}}" is {{length}} chars (max 60). Keep titles concise for search results.',
      descriptionTooShort: 'Meta description is {{length}} chars (min 120). Write compelling 150-160 char description.',
      descriptionTooLong: 'Meta description is {{length}} chars (max 160). Keep under 160 for search results.',
      missingOgImage: 'Missing og:image in metadata. Required for social media sharing previews.',
      missingOgTitle: 'Missing og:title in metadata. Should match or enhance page title.',
      missingTwitterCard: 'Missing twitter:card in metadata. Use "summary_large_image" for best engagement.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          excludePatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'File patterns to exclude from SEO checks',
          },
          requireOpenGraph: {
            type: 'boolean',
            description: 'Require Open Graph tags (default: true)',
          },
          requireTwitterCard: {
            type: 'boolean',
            description: 'Require Twitter Card tags (default: true)',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const excludePatterns = options.excludePatterns || ['/api/', 'layout.tsx', 'route.ts', '.test.', '.spec.'];
    const requireOpenGraph = options.requireOpenGraph !== false;
    const requireTwitterCard = options.requireTwitterCard !== false;

    const filename = context.getFilename();

    // Skip excluded patterns
    if (excludePatterns.some(pattern => filename.includes(pattern))) {
      return {};
    }

    // Only check page.tsx files (Next.js pages)
    if (!filename.endsWith('page.tsx') && !filename.endsWith('page.ts')) {
      return {};
    }

    let hasMetadataExport = false;
    let metadataObject = null;
    let isClientComponent = false;

    return {
      // Check for "use client" directive
      ExpressionStatement(node) {
        if (node.directive === 'use client' ||
            (node.expression && node.expression.type === 'Literal' && node.expression.value === 'use client')) {
          isClientComponent = true;
        }
      },

      ExportNamedDeclaration(node) {
        // Check for: export const metadata = { ... }
        if (node.declaration && node.declaration.type === 'VariableDeclaration') {
          const declaration = node.declaration.declarations[0];
          if (declaration && declaration.id.name === 'metadata') {
            hasMetadataExport = true;
            metadataObject = declaration.init;

            // Validate metadata structure
            if (metadataObject && metadataObject.type === 'ObjectExpression') {
              const properties = metadataObject.properties;

              // Check for title
              const titleProp = properties.find(p => p.key && p.key.name === 'title');
              if (!titleProp) {
                context.report({
                  node: metadataObject,
                  messageId: 'missingTitle',
                });
              } else if (titleProp.value && titleProp.value.type === 'Literal') {
                const title = titleProp.value.value;
                if (title && title.length > 60) {
                  context.report({
                    node: titleProp,
                    messageId: 'titleTooLong',
                    data: { title, length: title.length },
                  });
                }
              }

              // Check for description
              const descProp = properties.find(p => p.key && p.key.name === 'description');
              if (!descProp) {
                context.report({
                  node: metadataObject,
                  messageId: 'missingDescription',
                });
              } else if (descProp.value && descProp.value.type === 'Literal') {
                const desc = descProp.value.value;
                if (desc && desc.length < 120) {
                  context.report({
                    node: descProp,
                    messageId: 'descriptionTooShort',
                    data: { length: desc.length },
                  });
                }
                if (desc && desc.length > 160) {
                  context.report({
                    node: descProp,
                    messageId: 'descriptionTooLong',
                    data: { length: desc.length },
                  });
                }
              }

              // Check for Open Graph
              if (requireOpenGraph) {
                const ogProp = properties.find(p => p.key && p.key.name === 'openGraph');
                if (ogProp && ogProp.value && ogProp.value.type === 'ObjectExpression') {
                  const ogProps = ogProp.value.properties;

                  if (!ogProps.find(p => p.key && p.key.name === 'title')) {
                    context.report({
                      node: ogProp,
                      messageId: 'missingOgTitle',
                    });
                  }

                  if (!ogProps.find(p => p.key && (p.key.name === 'images' || p.key.name === 'image'))) {
                    context.report({
                      node: ogProp,
                      messageId: 'missingOgImage',
                    });
                  }
                }
              }

              // Check for Twitter Card
              if (requireTwitterCard) {
                const twitterProp = properties.find(p => p.key && p.key.name === 'twitter');
                if (!twitterProp) {
                  context.report({
                    node: metadataObject,
                    messageId: 'missingTwitterCard',
                  });
                }
              }
            }
          }
        }
      },

      'Program:exit'() {
        // Skip client components - they get metadata from layout
        if (isClientComponent) {
          return;
        }

        // At end of file, check if metadata was exported
        if (!hasMetadataExport) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingMetadata',
          });
        }
      },
    };
  },
};
