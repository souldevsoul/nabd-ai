/**
 * ESLint Rule: require-logo-links-home
 *
 * Ensures logo/brand links in headers always redirect to homepage ("/")
 * This is a universal UX pattern that users expect.
 *
 * DETECTS:
 * - Logo Link components with href not equal to "/"
 * - <a> tags with logo/brand images linking elsewhere
 * - Brand text links not pointing to homepage
 *
 * ALLOWS:
 * - href="/"
 * - href="/#section" (homepage with anchor)
 *
 * @date 2025-11-19
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure logo links always point to homepage',
      category: 'UX Consistency',
    },
    fixable: 'code',
    messages: {
      logoNotHome: 'Logo/brand link should point to "/" (homepage), not "{{href}}"',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();

    // Only check component files
    if (!filename.includes('components/') && !filename.includes('app/')) {
      return {};
    }

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.')) {
      return {};
    }

    /**
     * Check if this is likely a logo/brand link based on:
     * - Image alt text
     * - Link className
     * - Surrounding context
     */
    function isLogoLink(node) {
      const sourceCode = context.getSourceCode();

      // Check if Link has Image child with logo-related alt
      let hasLogoImage = false;
      let hasLogoClass = false;

      // Check className attribute
      const classNameAttr = node.openingElement.attributes.find(
        attr => attr.name && attr.name.name === 'className'
      );

      if (classNameAttr && classNameAttr.value) {
        const classValue = getAttributeValue(classNameAttr.value);
        if (classValue && typeof classValue === 'string') {
          const lowerClass = classValue.toLowerCase();
          hasLogoClass = lowerClass.includes('logo') ||
                        lowerClass.includes('brand') ||
                        lowerClass.includes('navbar-brand');
        }
      }

      // Check children for Image component
      if (node.children) {
        node.children.forEach(child => {
          if (child.type === 'JSXElement' && child.openingElement.name.name === 'Image') {
            const altAttr = child.openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'alt'
            );

            if (altAttr && altAttr.value) {
              const altValue = getAttributeValue(altAttr.value);
              if (altValue && typeof altValue === 'string') {
                const lowerAlt = altValue.toLowerCase();
                hasLogoImage = lowerAlt.includes('logo') ||
                              lowerAlt === context.getFilename().split('/').pop().replace(/\.tsx?$/, '').toLowerCase();
              }
            }

            // Also check src for logo patterns
            const srcAttr = child.openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'src'
            );

            if (srcAttr && srcAttr.value) {
              const srcValue = getAttributeValue(srcAttr.value);
              if (srcValue && typeof srcValue === 'string') {
                const lowerSrc = srcValue.toLowerCase();
                if (lowerSrc.includes('logo') || lowerSrc.includes('brand')) {
                  hasLogoImage = true;
                }
              }
            }
          }
        });
      }

      return hasLogoImage || hasLogoClass;
    }

    /**
     * Extract string value from JSX attribute value
     */
    function getAttributeValue(valueNode) {
      if (!valueNode) return null;

      // String literal: href="/"
      if (valueNode.type === 'Literal') {
        return valueNode.value;
      }

      // JSX expression: href={"/"}
      if (valueNode.type === 'JSXExpressionContainer') {
        const expr = valueNode.expression;

        if (expr.type === 'Literal') {
          return expr.value;
        }

        // Template literal with no expressions: href={`/`}
        if (expr.type === 'TemplateLiteral' && expr.quasis.length === 1 && expr.expressions.length === 0) {
          return expr.quasis[0].value.cooked;
        }
      }

      return null;
    }

    /**
     * Check if href value is acceptable (homepage or homepage with anchor)
     */
    function isValidLogoHref(href) {
      if (!href || typeof href !== 'string') return false;

      // Allow "/" or "/#anything"
      return href === '/' || href.startsWith('/#');
    }

    return {
      JSXElement(node) {
        const elementName = node.openingElement.name.name;

        // Check Link and <a> components
        if (elementName !== 'Link' && elementName !== 'a') {
          return;
        }

        // Check if this looks like a logo link
        if (!isLogoLink(node)) {
          return;
        }

        // Get href attribute
        const hrefAttr = node.openingElement.attributes.find(
          attr => attr.name && attr.name.name === 'href'
        );

        if (!hrefAttr || !hrefAttr.value) {
          return; // No href, different rule will catch this
        }

        const hrefValue = getAttributeValue(hrefAttr.value);

        // Check if href points to homepage
        if (!isValidLogoHref(hrefValue)) {
          context.report({
            node: hrefAttr,
            messageId: 'logoNotHome',
            data: {
              href: hrefValue || 'unknown',
            },
            fix(fixer) {
              // Only auto-fix string literal hrefs to avoid breaking dynamic values
              if (hrefAttr.value && hrefAttr.value.type === 'Literal') {
                return fixer.replaceText(hrefAttr.value, '"/"');
              }
              // For JSX expressions with literal values
              if (hrefAttr.value && hrefAttr.value.type === 'JSXExpressionContainer') {
                const expr = hrefAttr.value.expression;
                if (expr.type === 'Literal') {
                  return fixer.replaceText(hrefAttr.value, '"/"');
                }
              }
              return null;
            },
          });
        }
      },
    };
  },
};
