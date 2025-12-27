/**
 * @fileoverview Ensure text colors have sufficient contrast against backgrounds (WCAG AA)
 * @author AutoQA
 * @deprecated Use require-sufficient-contrast instead (more comprehensive)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure text colors have sufficient contrast against backgrounds (WCAG AA)',
      category: 'Accessibility',
      recommended: false,
      deprecated: true,
      replacedBy: ['require-sufficient-contrast'],
    },
    messages: {
      lowContrast:
        'Color combination has insufficient contrast ({{ratio}}:1). WCAG AA requires {{required}}:1 for {{type}}.',
      invalidColor: 'Color "{{color}}" is not in the style guide. Use approved colors only.',
      potentialContrastIssue:
        'Potential contrast issue: {{textColor}} on {{bgColor}}. Verify WCAG AA compliance (4.5:1 for normal text, 3.0:1 for large text).',
    },
    schema: [],
  },
  create(context) {
    // WCAG AA contrast requirements
    const CONTRAST_RATIOS = {
      'normal-text': 4.5,
      'large-text': 3.0, // 18px+ or 14px+ bold
    };

    // Tailwind color map (simplified - commonly problematic combinations)
    const knownBadCombinations = [
      { text: 'text-gray-400', bg: 'bg-white', issue: 'Low contrast (2.8:1)' },
      { text: 'text-gray-500', bg: 'bg-white', issue: 'Borderline contrast (4.3:1)' },
      { text: 'text-yellow-400', bg: 'bg-white', issue: 'Low contrast (1.9:1)' },
      { text: 'text-yellow-500', bg: 'bg-white', issue: 'Low contrast (2.9:1)' },
      { text: 'text-white', bg: 'bg-gray-200', issue: 'Low contrast (2.1:1)' },
      { text: 'text-black', bg: 'bg-gray-800', issue: 'Low contrast (2.4:1)' },
    ];

    function calculateLuminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function getContrastRatio(hex1, hex2) {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);
      if (!rgb1 || !rgb2) return null;

      const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
      const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    }

    return {
      JSXAttribute(node) {
        if (node.name.name === 'className' && node.value?.value) {
          const classes = node.value.value.split(' ');

          // Check for text color + background color combinations
          const textColors = classes.filter((c) => c.startsWith('text-') && !c.startsWith('text-xs') && !c.startsWith('text-sm') && !c.startsWith('text-lg') && !c.startsWith('text-xl') && !c.startsWith('text-2xl') && !c.startsWith('text-3xl') && !c.startsWith('text-4xl') && !c.startsWith('text-left') && !c.startsWith('text-center') && !c.startsWith('text-right'));
          const bgColors = classes.filter((c) => c.startsWith('bg-') && !c.startsWith('bg-opacity') && !c.startsWith('bg-gradient') && !c.startsWith('bg-none'));

          if (textColors.length > 0 && bgColors.length > 0) {
            // Check against known bad combinations
            textColors.forEach((textColor) => {
              bgColors.forEach((bgColor) => {
                const badCombo = knownBadCombinations.find(
                  (combo) => combo.text === textColor && combo.bg === bgColor
                );

                if (badCombo) {
                  context.report({
                    node,
                    messageId: 'potentialContrastIssue',
                    data: {
                      textColor,
                      bgColor,
                    },
                  });
                }
              });
            });
          }
        }
      },
    };
  },
};
