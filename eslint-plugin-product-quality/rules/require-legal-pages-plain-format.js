/**
 * ESLint Rule: require-legal-pages-plain-format
 *
 * Ensures legal/policy pages use plain text format without visual design elements.
 *
 * Legal pages should be professional documents in classic text format, not marketing pages.
 * This rule checks privacy, terms, cookies, refund, cancellation, payment, delivery, and GDPR pages.
 *
 * @version 1.0
 * @date 2025-11-19
 *
 * Detects:
 * - Icon imports from react-icons (RiXxxLine)
 * - Emoji characters in JSX
 * - Complex gradient backgrounds (except simple hero gradient)
 * - Card components and visual blocks
 * - Rounded corners (rounded-xl, rounded-2xl, etc.)
 * - Shadow effects (shadow-soft-md, shadow-glow-emerald, etc.)
 * - Colored borders (border-8 border-emerald-500, etc.)
 *
 * Allows:
 * - Simple hero gradient: bg-gradient-to-b from-gray-50 to-white
 * - Basic text styling: text-gray-700, font-bold, etc.
 * - Simple headers (h1, h2, h3, p, ul, li)
 *
 * Example violations:
 * ❌ import { RiShieldCheckLine } from "react-icons/ri"
 * ❌ <div className="bg-gradient-to-br from-emerald-500 to-teal-500">
 * ❌ <div className="rounded-xl shadow-soft-md">
 * ❌ <span>🔒 Security</span>
 *
 * Example correct usage:
 * ✅ <h1 className="text-6xl font-black text-gray-900">Privacy Policy</h1>
 * ✅ <p className="text-gray-700 leading-relaxed">Content...</p>
 * ✅ <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce plain text format for legal/policy pages without visual design elements',
      category: 'Legal Pages Quality',
      recommended: true,
    },
    messages: {
      iconImport: 'Legal pages should not use icon imports. Remove {{iconName}} from {{path}}',
      emojiInContent: 'Legal pages should not contain emojis. Remove "{{emoji}}" from {{path}}',
      complexGradient: 'Legal pages should use simple hero gradient only. Remove "{{className}}" from {{path}}',
      visualElement: 'Legal pages should not use visual design elements. Remove "{{element}}" from {{path}}',
      cardComponent: 'Legal pages should not use Card components. Use simple div/section instead in {{path}}',
      roundedCorners: 'Legal pages should not use rounded corners. Remove "{{className}}" from {{path}}',
      shadowEffect: 'Legal pages should not use shadow effects. Remove "{{className}}" from {{path}}',
      coloredBorder: 'Legal pages should not use colored borders. Remove "{{className}}" from {{path}}',
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
      // Check for icon imports
      ImportDeclaration(node) {
        if (node.source.value === 'react-icons/ri' || node.source.value.startsWith('react-icons/')) {
          node.specifiers.forEach(spec => {
            if (spec.type === 'ImportSpecifier') {
              context.report({
                node: spec,
                messageId: 'iconImport',
                data: {
                  iconName: spec.imported.name,
                  path: filename.split('/').slice(-2).join('/'),
                },
              });
            }
          });
        }
      },

      // Check for emoji characters in JSX
      JSXText(node) {
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        if (emojiRegex.test(node.value)) {
          const emoji = node.value.match(emojiRegex)[0];
          context.report({
            node,
            messageId: 'emojiInContent',
            data: {
              emoji,
              path: filename.split('/').slice(-2).join('/'),
            },
          });
        }
      },

      // Check for complex gradients (allow only simple hero gradient)
      JSXAttribute(node) {
        if (node.name.name === 'className' && node.value?.value) {
          const className = node.value.value;

          // Check for complex gradients (NOT the allowed hero gradient)
          if (className.includes('bg-gradient') &&
              !className.includes('bg-gradient-to-b from-gray-50 to-white')) {
            // Allow simple neutral gradients in hero
            const allowedHeroGradients = [
              'bg-gradient-to-b from-gray-50 to-white',
              'bg-gradient-to-b from-slate-50 to-white',
            ];

            const hasAllowedGradient = allowedHeroGradients.some(allowed =>
              className.includes(allowed)
            );

            if (!hasAllowedGradient && (
              className.includes('from-emerald') ||
              className.includes('from-teal') ||
              className.includes('to-emerald') ||
              className.includes('to-teal') ||
              className.includes('bg-gradient-to-br') ||
              className.includes('bg-gradient-to-r')
            )) {
              context.report({
                node,
                messageId: 'complexGradient',
                data: {
                  className,
                  path: filename.split('/').slice(-2).join('/'),
                },
              });
            }
          }

          // Check for rounded corners
          if (className.match(/rounded-(xl|2xl|3xl|full)/)) {
            context.report({
              node,
              messageId: 'roundedCorners',
              data: {
                className,
                path: filename.split('/').slice(-2).join('/'),
              },
            });
          }

          // Check for shadow effects
          if (className.match(/shadow-(soft|glow|lg|xl|2xl)/)) {
            context.report({
              node,
              messageId: 'shadowEffect',
              data: {
                className,
                path: filename.split('/').slice(-2).join('/'),
              },
            });
          }

          // Check for colored thick borders (including black)
          if (className.match(/border-(4|8)\s+border-(emerald|teal|blue|purple|pink|black)/) ||
              className.match(/border-(b|t|l|r)?-(4|8)\s+border-(emerald|teal|blue|purple|pink|black)/) ||
              className.match(/border-b-8\s+border-black/)) {
            context.report({
              node,
              messageId: 'coloredBorder',
              data: {
                className,
                path: filename.split('/').slice(-2).join('/'),
              },
            });
          }

          // Check for visual block backgrounds (bg-black for decorative elements)
          // Allow bg-white, bg-slate-50 etc, but not bg-black or bg-sky-50 decorative
          if (className.includes('bg-black') && !className.includes('text-')) {
            // bg-black is only allowed for text containers, not decorative blocks
            context.report({
              node,
              messageId: 'visualElement',
              data: {
                element: 'bg-black background',
                path: filename.split('/').slice(-2).join('/'),
              },
            });
          }
        }
      },

      // Check for Card component usage
      JSXOpeningElement(node) {
        if (node.name.name === 'Card') {
          context.report({
            node,
            messageId: 'cardComponent',
            data: {
              path: filename.split('/').slice(-2).join('/'),
            },
          });
        }
      },

      // Check for react-icons usage in object properties (e.g., icon: RiCheckLine)
      Property(node) {
        if (node.key.name === 'icon' && node.value.type === 'Identifier') {
          const iconName = node.value.name;
          // Check if it's a react-icons identifier (Ri*Line, Ri*Fill, etc.)
          if (/^Ri[A-Z][a-zA-Z]*(?:Line|Fill|Solid)$/.test(iconName)) {
            context.report({
              node: node.value,
              messageId: 'iconImport',
              data: {
                iconName,
                path: filename.split('/').slice(-2).join('/'),
              },
            });
          }
        }
      },
    };
  },
};
