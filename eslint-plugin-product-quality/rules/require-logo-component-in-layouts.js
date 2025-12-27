/**
 * ESLint Rule: require-logo-component-in-layouts
 *
 * Ensures layout files use a shared Logo component instead of hardcoding brand names.
 * This maintains brand consistency across all pages.
 *
 * Problem: Admin/specialist layouts often hardcode brand names like:
 *   <Heading>PropVideo</Heading>
 * Instead of using:
 *   <Logo />
 *
 * @author Senior QA Engineer
 * @version 1.22.0
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Layout files should use Logo component instead of hardcoded brand names',
      category: 'UX Consistency',
      recommended: true,
    },
    messages: {
      hardcodedBrand:
        'Found hardcoded brand name "{{name}}" in layout. Use Logo component from @/components for consistency.',
      missingLogoImport:
        'Layout renders brand/logo area but does not import Logo component. Use a shared Logo component for consistency.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          brandPatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Patterns that match brand names to detect',
          },
          logoComponentNames: {
            type: 'array',
            items: { type: 'string' },
            description: 'Accepted Logo component names',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const logoComponentNames = options.logoComponentNames || [
      'Logo',
      'BrandLogo',
      'SiteLogo',
      'AppLogo',
      'CompanyLogo',
    ];

    // Common SaaS brand name patterns (detect hardcoded names)
    const brandPatterns = options.brandPatterns || [
      // Common suffixes
      /[A-Z][a-z]+(?:Pro|Plus|AI|Hub|Lab|Forge|Craft|Master|Studio|Bot|Flow|Scope|Portal|App|Cloud)$/,
      // Common prefixes
      /^(?:Auto|Data|Code|Form|Logo|Reel|Prop|Book|Clip|Pet|Fashion|Voice|Tutor)[A-Z][a-z]+/,
    ];

    const filename = context.getFilename();

    // Only check layout files
    const isLayoutFile =
      filename.endsWith('/layout.tsx') ||
      filename.endsWith('/layout.jsx') ||
      filename.endsWith('/layout.js');

    if (!isLayoutFile) {
      return {};
    }

    let hasLogoImport = false;
    let hasLogoUsage = false;
    const hardcodedBrands = [];

    return {
      // Check imports for Logo component
      ImportDeclaration(node) {
        node.specifiers.forEach((specifier) => {
          const importedName = specifier.local?.name || '';
          if (logoComponentNames.includes(importedName)) {
            hasLogoImport = true;
          }
        });
      },

      // Check JSX for Logo component usage
      JSXIdentifier(node) {
        if (logoComponentNames.includes(node.name)) {
          hasLogoUsage = true;
        }
      },

      // Check for hardcoded brand names in JSX text
      JSXText(node) {
        const text = node.value.trim();
        if (!text) return;

        // Check against brand patterns
        for (const pattern of brandPatterns) {
          if (pattern instanceof RegExp) {
            const match = text.match(pattern);
            if (match && match[0].length > 3) {
              // Only if it looks like a proper brand name (starts with capital)
              if (/^[A-Z]/.test(text)) {
                hardcodedBrands.push({
                  node,
                  name: text,
                });
              }
            }
          }
        }
      },

      // Check string literals in JSX (for cases like <Heading>{"PropVideo"}</Heading>)
      Literal(node) {
        // Only check string literals
        if (typeof node.value !== 'string') return;

        const text = node.value.trim();
        if (!text || text.length < 4) return;

        // Check if we're inside a JSX context
        let parent = node.parent;
        let isInJSX = false;
        while (parent) {
          if (parent.type === 'JSXElement' || parent.type === 'JSXExpressionContainer') {
            isInJSX = true;
            break;
          }
          parent = parent.parent;
        }

        if (!isInJSX) return;

        // Check against brand patterns
        for (const pattern of brandPatterns) {
          if (pattern instanceof RegExp) {
            const match = text.match(pattern);
            if (match && match[0] === text) {
              hardcodedBrands.push({
                node,
                name: text,
              });
            }
          }
        }
      },

      // Check Heading/Title elements specifically
      JSXElement(node) {
        const openingElement = node.openingElement;
        const elementName = openingElement.name?.name || '';

        // Check Heading, Title, h1, h2 elements in header/sidebar areas
        if (['Heading', 'Title', 'h1', 'h2'].includes(elementName)) {
          const source = context.getSourceCode();
          const elementText = source.getText(node);

          // Check for common brand name patterns in the element
          for (const pattern of brandPatterns) {
            if (pattern instanceof RegExp) {
              const match = elementText.match(pattern);
              if (match) {
                // Check if this is in a sidebar/header area (check parent context)
                const ancestors = context.getAncestors();
                const inSidebarOrHeader = ancestors.some((ancestor) => {
                  if (ancestor.type === 'JSXElement') {
                    const name = ancestor.openingElement?.name?.name || '';
                    return ['aside', 'Sidebar', 'header', 'Header', 'nav'].includes(name);
                  }
                  return false;
                });

                if (inSidebarOrHeader) {
                  hardcodedBrands.push({
                    node,
                    name: match[0],
                  });
                }
              }
            }
          }
        }
      },

      'Program:exit'() {
        // Report hardcoded brand names
        const reported = new Set();
        for (const { node, name } of hardcodedBrands) {
          // Avoid duplicate reports for same name
          if (!reported.has(name)) {
            reported.add(name);
            context.report({
              node,
              messageId: 'hardcodedBrand',
              data: { name },
            });
          }
        }
      },
    };
  },
};
