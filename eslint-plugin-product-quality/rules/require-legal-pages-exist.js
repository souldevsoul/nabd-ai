/**
 * ESLint Rule: require-legal-pages-exist
 *
 * Ensures that all legal page links in Footer/Header components point to existing page files.
 *
 * This rule checks components that contain footer/header links and validates:
 * - Links to /terms, /privacy, /cookie-policy, /refund-policy, /cancellation-policy exist
 * - Corresponding page.tsx files exist in app/ directory
 *
 * @version 1.4.1
 * @date 2025-11-20
 *
 * Detects:
 * - Footer/Header components with links to legal pages
 * - Missing page.tsx files for linked routes
 *
 * Example violations:
 * ❌ Link href="/terms" exists but app/terms/page.tsx is missing
 * ❌ Link href="/privacy" exists but app/privacy/page.tsx is missing
 * ❌ Link href="/cookie-policy" exists but app/cookie-policy/page.tsx is missing
 *
 * Example correct usage:
 * ✅ Link href="/terms" exists AND app/terms/page.tsx exists
 * ✅ Link href="/privacy" exists AND app/privacy/page.tsx exists
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure all legal page links point to existing page files',
      category: 'Legal Pages Quality',
      recommended: true,
    },
    messages: {
      missingLegalPage: 'Link to "{{route}}" found but page file is missing. Create {{expectedPath}}',
      missingMultipleLegalPages: 'Found {{count}} legal page links but pages are missing: {{routes}}. Create the corresponding page.tsx files in app/ directory.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only check Footer and Header components
    const isFooterOrHeader = /\/(footer|header)\.tsx$/i.test(filename);

    if (!isFooterOrHeader) {
      return {};
    }

    // Legal routes that should have corresponding pages
    const legalRoutes = [
      '/terms',
      '/privacy',
      '/cookie-policy',
      '/refund-policy',
      '/cancellation-policy',
      '/payment-policy',
      '/delivery-policy',
      '/gdpr',
    ];

    // Store found links
    const foundLinks = [];

    return {
      // Check href attributes in JSX
      JSXAttribute(node) {
        if (node.name.name === 'href' && node.value?.value) {
          const href = node.value.value;

          // Check if this is a legal page link
          if (legalRoutes.includes(href)) {
            foundLinks.push({ href, node });
          }
        }
      },

      // Check string literals in object properties (e.g., {href: "/terms"})
      Literal(node) {
        if (typeof node.value === 'string' && legalRoutes.includes(node.value)) {
          // Check if this is in an object property named 'href'
          if (node.parent && node.parent.type === 'Property') {
            const keyName = node.parent.key.name || node.parent.key.value;
            if (keyName === 'href') {
              foundLinks.push({ href: node.value, node });
            }
          }
        }
      },

      'Program:exit'() {
        if (foundLinks.length === 0) {
          return;
        }

        // Find project root (where app/ directory is)
        let currentDir = path.dirname(filename);
        let projectRoot = null;

        // Walk up until we find app/ directory
        for (let i = 0; i < 10; i++) {
          const appDir = path.join(currentDir, 'app');
          if (fs.existsSync(appDir)) {
            projectRoot = currentDir;
            break;
          }
          currentDir = path.dirname(currentDir);
        }

        if (!projectRoot) {
          // Can't find project root, skip validation
          return;
        }

        const missingPages = [];

        // Check each found link
        for (const { href, node } of foundLinks) {
          const route = href.replace('/', '');

          // Possible page locations
          const possiblePaths = [
            path.join(projectRoot, 'app', route, 'page.tsx'),
            path.join(projectRoot, 'app', '(legal)', route, 'page.tsx'),
            path.join(projectRoot, 'app', '(marketing)', route, 'page.tsx'),
          ];

          // Check if any of the possible paths exist
          const pageExists = possiblePaths.some(p => fs.existsSync(p));

          if (!pageExists) {
            missingPages.push({
              route: href,
              expectedPath: `app/${route}/page.tsx or app/(legal)/${route}/page.tsx`,
              node,
            });
          }
        }

        // Report missing pages
        if (missingPages.length > 0) {
          if (missingPages.length === 1) {
            context.report({
              node: missingPages[0].node,
              messageId: 'missingLegalPage',
              data: {
                route: missingPages[0].route,
                expectedPath: missingPages[0].expectedPath,
              },
            });
          } else {
            // Report all missing pages at once
            context.report({
              node: foundLinks[0].node,
              messageId: 'missingMultipleLegalPages',
              data: {
                count: missingPages.length,
                routes: missingPages.map(p => p.route).join(', '),
              },
            });
          }
        }
      },
    };
  },
};
