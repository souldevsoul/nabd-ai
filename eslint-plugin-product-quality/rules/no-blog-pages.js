/**
 * ESLint Rule: no-blog-pages
 *
 * Prevents creation of blog pages/directories in AI SaaS products.
 * Blogs require ongoing content creation and maintenance which is not feasible for MVP products.
 *
 * @version 1.3.3
 * @date 2025-11-20
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent blog pages/directories - blogs require ongoing content maintenance',
      category: 'Content Restrictions',
      recommended: true,
    },
    messages: {
      noBlogDirectory: 'Blog directory detected at "{{path}}". Remove blog - AI SaaS MVPs should not have blogs (requires ongoing content creation).',
      noBlogPage: 'Blog page detected: "{{file}}". Remove blog pages - focus on core product features instead of content marketing.',
      noBlogLink: 'Blog link detected in navigation. Remove blog links from header/footer.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();
    const cwd = context.getCwd();

    // Check for blog directory existence
    const blogDir = path.join(cwd, 'app', 'blog');
    const blogDirExists = fs.existsSync(blogDir);

    // Check if current file is in blog directory
    const isInBlogDir = filename.includes('/blog/') || filename.includes('\\blog\\');

    // Check if file is a blog page
    const isBlogPage = /\/blog\/.*\.(tsx|jsx|ts|js)$/.test(filename);

    return {
      Program(node) {
        // Report if blog directory exists (only once per file check)
        if (blogDirExists && !isInBlogDir) {
          context.report({
            node,
            messageId: 'noBlogDirectory',
            data: {
              path: 'app/blog/',
            },
          });
        }

        // Report if current file is a blog page
        if (isBlogPage) {
          context.report({
            node,
            messageId: 'noBlogPage',
            data: {
              file: path.relative(cwd, filename),
            },
          });
        }
      },

      // Check for blog links in navigation
      JSXElement(node) {
        const openingElement = node.openingElement;
        if (!openingElement) return;

        // Check <Link href="/blog">
        if (openingElement.name && openingElement.name.name === 'Link') {
          const hrefAttr = openingElement.attributes.find(
            attr => attr.name && attr.name.name === 'href'
          );

          if (hrefAttr && hrefAttr.value) {
            const hrefValue = hrefAttr.value.value || '';
            if (hrefValue === '/blog' || hrefValue.startsWith('/blog/')) {
              context.report({
                node: hrefAttr,
                messageId: 'noBlogLink',
              });
            }
          }
        }

        // Check <a href="/blog">
        if (openingElement.name && openingElement.name.name === 'a') {
          const hrefAttr = openingElement.attributes.find(
            attr => attr.name && attr.name.name === 'href'
          );

          if (hrefAttr && hrefAttr.value) {
            const hrefValue = hrefAttr.value.value || '';
            if (hrefValue === '/blog' || hrefValue.startsWith('/blog/')) {
              context.report({
                node: hrefAttr,
                messageId: 'noBlogLink',
              });
            }
          }
        }
      },

      // Check for blog text in navigation items
      JSXText(node) {
        const text = node.value.trim();
        const filename = context.getFilename();

        // Only check in header/footer components
        const isNavComponent = /\/(header|footer|navbar)\.tsx?$/.test(filename);

        if (isNavComponent && /^blog$/i.test(text)) {
          context.report({
            node,
            messageId: 'noBlogLink',
          });
        }
      },
    };
  },
};
