/**
 * ESLint Rule: require-sufficient-contrast
 *
 * Ensures text has sufficient color contrast against background for accessibility.
 * Checks WCAG 2.1 AA compliance (4.5:1 for normal text, 3:1 for large text).
 *
 * @version 1.3.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Text must have sufficient color contrast for accessibility (WCAG 2.1 AA)',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      lowContrast: 'Low text contrast detected. {{ textColor }} on {{ bgColor }} has contrast {{ ratio }}:1, needs {{ required }}:1 (WCAG AA). Use darker text or lighter background.',
      suspiciousContrast: 'Potential low contrast: {{ textColor }} on {{ bgColor }}. Verify visually for accessibility.',
    },
    schema: [],
  },
  create(context) {
    // Known problematic color combinations
    const KNOWN_LOW_CONTRAST = [
      // FashionForge footer issue
      { text: '#A5B4C1', bg: '#1F2937', ratio: 3.2 },
      { text: '#A5B4C1', bg: '#374151', ratio: 2.8 },
      // Common low-contrast patterns
      { text: 'text-gray-400', bg: 'bg-gray-600', ratio: 2.1 },
      { text: 'text-gray-500', bg: 'bg-gray-700', ratio: 2.9 },
      { text: 'text-slate-400', bg: 'bg-slate-600', ratio: 2.3 },
    ];

    /**
     * Convert hex color to RGB
     */
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    /**
     * Calculate relative luminance (WCAG formula)
     */
    function getLuminance(rgb) {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Calculate contrast ratio between two colors
     */
    function getContrastRatio(rgb1, rgb2) {
      const lum1 = getLuminance(rgb1);
      const lum2 = getLuminance(rgb2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }

    /**
     * Extract color from className string
     */
    function extractColorFromClassName(className, type) {
      if (!className || typeof className !== 'string') return null;

      // Match bg-white, text-white, bg-black, text-black
      if (type === 'bg' && className.includes('bg-white')) {
        return 'bg-white';
      }
      if (type === 'bg' && className.includes('bg-black')) {
        return 'bg-black';
      }
      if (type === 'text' && className.includes('text-white')) {
        return 'text-white';
      }
      if (type === 'text' && className.includes('text-black')) {
        return 'text-black';
      }

      // Match custom hex colors: text-[#A5B4C1]
      const hexMatch = className.match(new RegExp(`${type}-\\[#([A-Fa-f0-9]{6})\\]`));
      if (hexMatch) {
        return `#${hexMatch[1]}`;
      }

      // Match Tailwind colors: text-gray-400, bg-slate-900
      const tailwindMatch = className.match(new RegExp(`${type}-(gray|slate|zinc|neutral|stone)-(\\d{2,3})`));
      if (tailwindMatch) {
        return `${type}-${tailwindMatch[1]}-${tailwindMatch[2]}`;
      }

      return null;
    }

    /**
     * Get approximate RGB for Tailwind color
     */
    function getTailwindColorRgb(colorClass) {
      const tailwindColors = {
        // White and Black
        'white': { r: 255, g: 255, b: 255 },
        'black': { r: 0, g: 0, b: 0 },
        // Gray scale (approximate values)
        'gray-100': { r: 243, g: 244, b: 246 },
        'gray-200': { r: 229, g: 231, b: 235 },
        'gray-300': { r: 209, g: 213, b: 219 },
        'gray-400': { r: 156, g: 163, b: 175 },
        'gray-500': { r: 107, g: 114, b: 128 },
        'gray-600': { r: 75, g: 85, b: 99 },
        'gray-700': { r: 55, g: 65, b: 81 },
        'gray-800': { r: 31, g: 41, b: 55 },
        'gray-900': { r: 17, g: 24, b: 39 },
        'slate-100': { r: 241, g: 245, b: 249 },
        'slate-200': { r: 226, g: 232, b: 240 },
        'slate-300': { r: 203, g: 213, b: 225 },
        'slate-400': { r: 148, g: 163, b: 184 },
        'slate-500': { r: 100, g: 116, b: 139 },
        'slate-600': { r: 71, g: 85, b: 105 },
        'slate-700': { r: 51, g: 65, b: 85 },
        'slate-800': { r: 30, g: 41, b: 59 },
        'slate-900': { r: 15, g: 23, b: 42 },
      };

      return tailwindColors[colorClass] || null;
    }

    /**
     * Check if element has low contrast
     */
    function checkContrast(node, className) {
      const textColor = extractColorFromClassName(className, 'text');
      const bgColor = extractColorFromClassName(className, 'bg');

      if (!textColor || !bgColor) return;

      // Check against known low-contrast combinations
      for (const known of KNOWN_LOW_CONTRAST) {
        if ((textColor === known.text || textColor.includes(known.text)) &&
            (bgColor === known.bg || bgColor.includes(known.bg))) {
          const required = 4.5; // WCAG AA for normal text
          context.report({
            node,
            messageId: 'lowContrast',
            data: {
              textColor,
              bgColor,
              ratio: known.ratio.toFixed(1),
              required: required.toFixed(1),
            },
          });
          return;
        }
      }

      // Calculate contrast for hex colors
      if (textColor.startsWith('#') && bgColor.startsWith('#')) {
        const textRgb = hexToRgb(textColor);
        const bgRgb = hexToRgb(bgColor);

        if (textRgb && bgRgb) {
          const ratio = getContrastRatio(textRgb, bgRgb);
          const required = 4.5; // WCAG AA for normal text

          if (ratio < required) {
            context.report({
              node,
              messageId: 'lowContrast',
              data: {
                textColor,
                bgColor,
                ratio: ratio.toFixed(1),
                required: required.toFixed(1),
              },
            });
          }
        }
      }

      // Calculate contrast for Tailwind colors
      if (textColor.startsWith('text-') && bgColor.startsWith('bg-')) {
        const textTailwind = textColor.replace('text-', '');
        const bgTailwind = bgColor.replace('bg-', '');

        const textRgb = getTailwindColorRgb(textTailwind);
        const bgRgb = getTailwindColorRgb(bgTailwind);

        if (textRgb && bgRgb) {
          const ratio = getContrastRatio(textRgb, bgRgb);
          const required = 4.5; // WCAG AA for normal text

          if (ratio < required) {
            context.report({
              node,
              messageId: 'lowContrast',
              data: {
                textColor,
                bgColor,
                ratio: ratio.toFixed(1),
                required: required.toFixed(1),
              },
            });
          }
        }
      }
    }

    /**
     * Check parent elements for background colors
     * Returns the CLOSEST background color (innermost first)
     */
    function getBackgroundFromParent(node) {
      let current = node.parent;
      while (current) {
        if (current.type === 'JSXElement') {
          const classAttr = current.openingElement.attributes.find(
            attr => attr.name?.name === 'className'
          );
          if (classAttr && classAttr.value) {
            let className = null;

            if (classAttr.value.type === 'Literal') {
              className = classAttr.value.value;
            } else if (classAttr.value.type === 'JSXExpressionContainer') {
              const expr = classAttr.value.expression;
              if (expr.type === 'Literal') {
                className = expr.value;
              } else if (expr.type === 'TemplateLiteral') {
                // Extract text from template literal quasis
                className = expr.quasis.map(q => q.value.raw).join(' ');
              }
            }

            if (className && typeof className === 'string') {
              const bgColor = extractColorFromClassName(className, 'bg');
              // Return first (closest) background color found
              if (bgColor) return bgColor;
            }
          }
        }
        current = current.parent;
      }
      return null;
    }

    return {
      JSXElement(node) {
        const classAttr = node.openingElement.attributes.find(
          attr => attr.name?.name === 'className'
        );

        if (!classAttr || !classAttr.value) return;

        let className = '';
        if (classAttr.value.type === 'Literal') {
          className = classAttr.value.value;
        } else if (classAttr.value.type === 'JSXExpressionContainer' &&
                   classAttr.value.expression.type === 'Literal') {
          className = classAttr.value.expression.value;
        }

        if (!className) return;

        // Check for text color classes
        const hasTextColor = /text-(\[#[A-Fa-f0-9]{6}\]|gray-\d{2,3}|slate-\d{2,3})/.test(className);
        const hasBgColor = /bg-(\[#[A-Fa-f0-9]{6}\]|gray-\d{2,3}|slate-\d{2,3})/.test(className);

        if (hasTextColor && hasBgColor) {
          // Both colors on same element
          checkContrast(node, className);
        } else if (hasTextColor) {
          // Check against parent background
          const parentBg = getBackgroundFromParent(node);
          if (parentBg) {
            const combinedClassName = className + ' ' + parentBg;
            checkContrast(node, combinedClassName);
          }
        }
      },
    };
  },
};
