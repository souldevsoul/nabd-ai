/**
 * ESLint Rule: require-consistent-logo
 *
 * Ensures all logo references across the application use consistent visual elements.
 * Prevents inconsistent branding with different logos/icons in different parts of the site.
 * Checks Image components, emojis, and Lucide icons used in logo contexts.
 *
 * IMPORTANT: This rule now REQUIRES Image component for logo rendering.
 * Using inline icons (Sparkles, Star, etc.) or divs with gradients is NOT allowed
 * as the logo - must use <Image src="/images/logo/..." /> for consistency.
 *
 * @version 2.6
 * @date 2025-11-26
 * @strictness error (build fails if violated)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require consistent logo visual elements across all components',
      category: 'Brand Consistency',
      recommended: true,
    },
    messages: {
      inconsistentLogo: 'Logo file "{{currentLogo}}" differs from primary logo "{{primaryLogo}}". Use consistent logo across the site.',
      inconsistentIcon: 'Logo uses "{{currentIcon}}" but primary logo uses "{{primaryIcon}}". Use consistent logo icon across header, footer, and other components.',
      preferSvg: 'Consider using SVG logo instead of "{{format}}" for better performance and scalability.',
      iconAsLogo: 'Icon "{{icon}}" used as logo. Use <Image src="/images/logo/..." /> instead for consistent branding across the site.',
    },
    schema: [],
  },

  create(context) {
    const logoReferences = [];
    const logoIcons = []; // Track emojis and Lucide icons

    // Common icon names that might be incorrectly used as logos
    const commonLogoIcons = [
      'Sparkles', 'Star', 'Zap', 'Heart', 'Award', 'Crown', 'Diamond',
      'Rocket', 'Lightning', 'Fire', 'Flame', 'Sun', 'Moon',
      'Wand2', 'Wand', 'Magic', 'Brush', 'Palette', 'Camera', 'Film', 'Video',
      'Music', 'Mic', 'Headphones', 'Book', 'Pen', 'Edit', 'Code',
    ];

    // Helper: Check if element is in logo context
    // Only considers icons that are inside a Link to "/" (homepage link) as logo context
    function isInLogoContext(node) {
      let current = node;
      while (current) {
        // Check if parent is a Link to "/" - this is the ONLY valid logo context
        if (current.type === 'JSXElement' &&
            current.openingElement &&
            current.openingElement.name &&
            current.openingElement.name.name === 'Link') {
          const hrefAttr = current.openingElement.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'href'
          );

          if (hrefAttr && hrefAttr.value) {
            const hrefValue = hrefAttr.value.type === 'Literal'
              ? hrefAttr.value.value
              : hrefAttr.value.type === 'JSXExpressionContainer' &&
                hrefAttr.value.expression.type === 'Literal'
              ? hrefAttr.value.expression.value
              : null;

            if (hrefValue === '/') {
              return true; // Logo links to homepage
            }
          }
        }

        current = current.parent;
      }

      // Icons in header/footer but NOT inside Link href="/" are NOT logo context
      // They could be navigation icons, social icons, contact icons, etc.
      return false;
    }

    return {
      // Check all Image components and icons
      JSXOpeningElement(node) {
        // Check Lucide icons in logo context
        const lucideIconNames = ['Heart', 'Star', 'Circle', 'Square', 'Zap', 'Award', 'Video', 'Film', 'Camera', 'Play'];
        // Check react-icons in logo context (Ri = Remix Icons, Si = Simple Icons, etc.)
        const reactIconPatterns = [
          /^Ri[A-Z]/, // Remix Icons (RiVideoLine, RiHomeLine, etc.)
          /^Si[A-Z]/, // Simple Icons
          /^Fa[A-Z]/, // Font Awesome
          /^Md[A-Z]/, // Material Design
          /^Io[A-Z]/, // Ionicons
          /^Bi[A-Z]/, // BoxIcons
        ];

        const iconName = node.name.name;
        const isLucideIcon = lucideIconNames.includes(iconName);
        const isReactIcon = reactIconPatterns.some(pattern => pattern.test(iconName));
        const isCommonLogoIcon = commonLogoIcons.includes(iconName);

        // Report error immediately if common logo icon is used in logo context
        if ((isLucideIcon || isReactIcon || isCommonLogoIcon) && isInLogoContext(node)) {
          // This is an error - should use Image instead of icon for logo
          context.report({
            node: node,
            messageId: 'iconAsLogo',
            data: { icon: iconName },
          });

          logoIcons.push({
            file: context.getFilename(),
            icon: iconName,
            type: isReactIcon ? 'react-icons' : 'lucide',
            node: node,
            line: node.loc.start.line,
          });
        }

        if (node.name.name === 'Image') {
          // Find src attribute
          const srcAttr = node.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'src'
          );

          if (!srcAttr || !srcAttr.value) return;

          // Get src value
          let srcValue = null;
          if (srcAttr.value.type === 'Literal') {
            srcValue = srcAttr.value.value;
          } else if (
            srcAttr.value.type === 'JSXExpressionContainer' &&
            srcAttr.value.expression.type === 'Literal'
          ) {
            srcValue = srcAttr.value.expression.value;
          }

          if (!srcValue || typeof srcValue !== 'string') return;

          // Check if this is a logo file
          const logoPatterns = [
            /\/logo[\/\-_]/i,           // /logo/, /logo-, /logo_
            /\/images\/logo\//i,        // /images/logo/
            /logo\.(svg|png|jpg|webp)/i, // logo.svg, logo.png, etc.
          ];

          const isLogo = logoPatterns.some(pattern => pattern.test(srcValue));
          if (!isLogo) return;

          // Store logo reference
          logoReferences.push({
            file: context.getFilename(),
            path: srcValue,
            node: srcAttr,
            line: srcAttr.loc.start.line,
          });
        }
      },

      // Check for emojis in text content
      Literal(node) {
        if (typeof node.value !== 'string') return;
        if (!isInLogoContext(node)) return;

        // Detect emojis (simple regex for common emojis)
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
        const match = node.value.match(emojiRegex);

        if (match) {
          logoIcons.push({
            file: context.getFilename(),
            icon: node.value.trim(),
            type: 'emoji',
            node: node,
            line: node.loc.start.line,
          });
        }
      },

      // At the end of file, check for consistency
      'Program:exit'() {
        // Check logo icon consistency
        if (logoIcons.length > 1) {
          // Group by icon
          const iconGroups = {};
          logoIcons.forEach(ref => {
            if (!iconGroups[ref.icon]) {
              iconGroups[ref.icon] = [];
            }
            iconGroups[ref.icon].push(ref);
          });

          const iconTypes = Object.keys(iconGroups);

          if (iconTypes.length > 1) {
            // Determine primary icon (most used)
            const primaryIcon = iconTypes.reduce((a, b) =>
              iconGroups[a].length > iconGroups[b].length ? a : b
            );

            // Report all non-primary icon usages
            iconTypes.forEach(iconType => {
              if (iconType === primaryIcon) return;

              iconGroups[iconType].forEach(ref => {
                context.report({
                  node: ref.node,
                  messageId: 'inconsistentIcon',
                  data: {
                    currentIcon: `${ref.type}:${ref.icon}`,
                    primaryIcon: `${logoIcons.find(i => i.icon === primaryIcon)?.type}:${primaryIcon}`,
                  },
                });
              });
            });
          }
        }

        if (logoReferences.length === 0) return;

        // Group by logo path
        const logoGroups = {};
        logoReferences.forEach(ref => {
          if (!logoGroups[ref.path]) {
            logoGroups[ref.path] = [];
          }
          logoGroups[ref.path].push(ref);
        });

        const logoPaths = Object.keys(logoGroups);

        // If only one unique logo - all good!
        if (logoPaths.length === 1) {
          const logoPath = logoPaths[0];

          // But suggest SVG if using raster format
          const format = logoPath.match(/\.(png|jpg|jpeg|webp|gif)$/i);
          if (format) {
            logoReferences.forEach(ref => {
              context.report({
                node: ref.node,
                messageId: 'preferSvg',
                data: {
                  format: format[1].toUpperCase(),
                },
              });
            });
          }
          return;
        }

        // Multiple different logos found - report error!
        // Determine which logo is "primary" (most used)
        const primaryLogo = logoPaths.reduce((a, b) =>
          logoGroups[a].length > logoGroups[b].length ? a : b
        );

        // Report all non-primary logo usages
        logoPaths.forEach(logoPath => {
          if (logoPath === primaryLogo) return;

          logoGroups[logoPath].forEach(ref => {
            context.report({
              node: ref.node,
              messageId: 'inconsistentLogo',
              data: {
                currentLogo: logoPath,
                primaryLogo: primaryLogo,
              },
            });
          });
        });
      },
    };
  },
};
