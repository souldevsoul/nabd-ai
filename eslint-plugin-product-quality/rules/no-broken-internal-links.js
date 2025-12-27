/**
 * ESLint Rule: no-broken-internal-links
 *
 * Ensures all internal links point to existing pages.
 * Prevents 404 errors from broken navigation.
 *
 * Now checks both JSX href attributes AND string literals in data objects
 * (e.g., ctaHref: "/signup", href: "/contact")
 *
 * @version 2.13
 * @updated 2025-11-19 - Added string literal checking for data objects
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
/* eslint-enable @typescript-eslint/no-require-imports */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure all internal links point to existing pages',
      category: 'Product Quality',
      recommended: true,
    },
    messages: {
      brokenLink: 'Internal link "{{href}}" points to non-existent page. This will cause a 404 error.',
    },
    schema: [],
  },
  create(context) {
    /**
     * Check if a path exists in the file system
     */
    function checkPathExists(href, node) {
      if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) {
        return; // Not an internal link
      }

      const cleanPath = href.split('#')[0].split('?')[0];

      // Skip API routes - they are endpoints, not pages
      if (cleanPath.startsWith('/api/')) {
        return;
      }

      // Try both app and src/app directories
      const baseDirs = [path.join(context.getCwd(), 'app'), path.join(context.getCwd(), 'src', 'app')];

      let fileExists = false;

      for (const baseDir of baseDirs) {
        // Check direct path
        const directFiles = [
          path.join(baseDir, cleanPath, 'page.tsx'),
          path.join(baseDir, cleanPath, 'page.jsx'),
        ];

        if (directFiles.some((file) => fs.existsSync(file))) {
          fileExists = true;
          break;
        }

        // Check with dynamic route patterns like [locale]
        try {
          const searchDir = fs.existsSync(baseDir) ? fs.readdirSync(baseDir) : [];
          for (const entry of searchDir) {
            // Check for [locale] or other dynamic segments
            if (entry.startsWith('[') && entry.endsWith(']')) {
              const dynamicPath = path.join(baseDir, entry);
              const nestedFiles = [
                path.join(dynamicPath, cleanPath, 'page.tsx'),
                path.join(dynamicPath, cleanPath, 'page.jsx'),
                path.join(dynamicPath, '(unauth)', cleanPath, 'page.tsx'),
                path.join(dynamicPath, '(unauth)', cleanPath, 'page.jsx'),
                path.join(dynamicPath, '(auth)', cleanPath, 'page.tsx'),
                path.join(dynamicPath, '(auth)', cleanPath, 'page.jsx'),
              ];

              if (nestedFiles.some((file) => fs.existsSync(file))) {
                fileExists = true;
                break;
              }
            }

            // Check for route groups like (marketing), (dashboard), etc.
            if (entry.startsWith('(') && entry.endsWith(')')) {
              const routeGroupPath = path.join(baseDir, entry);
              const routeGroupFiles = [
                path.join(routeGroupPath, cleanPath, 'page.tsx'),
                path.join(routeGroupPath, cleanPath, 'page.jsx'),
              ];

              if (routeGroupFiles.some((file) => fs.existsSync(file))) {
                fileExists = true;
                break;
              }
            }
          }
        } catch {
          // Ignore errors reading directory
        }

        if (fileExists) {
          break;
        }
      }

      if (!fileExists && cleanPath !== '/' && cleanPath !== '') {
        context.report({
          node,
          messageId: 'brokenLink',
          data: { href },
        });
      }
    }

    return {
      // Check JSX href attributes (e.g., <Link href="/path">)
      JSXAttribute(node) {
        if (node.name.name === 'href') {
          // Handle string literals: href="/path"
          if (node.value?.type === 'Literal') {
            checkPathExists(node.value.value, node);
          }
          // Handle JSXExpressionContainer: href={"/path"}
          else if (node.value?.type === 'JSXExpressionContainer' &&
                   node.value.expression?.type === 'Literal') {
            checkPathExists(node.value.expression.value, node);
          }
        }
      },

      // Check object properties with href-like names (e.g., ctaHref: "/path", href: "/path")
      Property(node) {
        // Check if property name contains 'href' or 'Href'
        const propertyName = node.key.name || node.key.value;
        if (
          propertyName &&
          typeof propertyName === 'string' &&
          (propertyName.toLowerCase().includes('href') || propertyName === 'href')
        ) {
          // Check if value is a string literal
          if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
            checkPathExists(node.value.value, node.value);
          }
        }
      },
    };
  },
};
