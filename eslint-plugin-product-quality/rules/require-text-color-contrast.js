/**
 * ESLint Rule: require-text-color-contrast
 * Ensures text elements have sufficient color contrast against their backgrounds.
 * Prevents unreadable text (e.g., dark text on dark background).
 * @version 2.9
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require sufficient text color contrast against background colors',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      darkBgNeedsLightText: 'Element with dark background ({{bgClass}}) should have light text color. Add text-white, text-gray-100, or similar.',
      lightBgNeedsDarkText: 'Element with light background ({{bgClass}}) should have dark text color. Add text-slate-900, text-black, or similar.',
      avoidGlobalCssConflicts: 'Heading element ({{tagName}}) in dark background needs explicit text color to avoid globals.css conflicts.',
    },
    schema: [],
  },

  create(context) {
    // Dark background classes that need light text
    const darkBackgrounds = [
      'bg-black',
      'bg-slate-900',
      'bg-slate-800',
      'bg-gray-900',
      'bg-gray-800',
      // PetPortrait AI dark backgrounds
      'bg-orange-900',
      'bg-orange-800',
      'bg-amber-900',
      'bg-amber-800',
      'bg-coral-900',
      'bg-coral-800',
      'bg-rose-900',
      'bg-rose-800',
    ];

    // Light background classes that need dark text
    const lightBackgrounds = [
      'bg-white',
      'bg-slate-50',
      'bg-slate-100',
      'bg-gray-50',
      'bg-gray-100',
      // PetPortrait AI light backgrounds
      'bg-orange-50',
      'bg-orange-100',
      'bg-amber-50',
      'bg-amber-100',
      'bg-coral-50',
      'bg-coral-100',
      'bg-rose-50',
      'bg-rose-100',
      'bg-warm-gray-50',
      'bg-warm-gray-100',
    ];

    // Light text colors (for dark backgrounds)
    const lightTextColors = [
      'text-white',
      'text-slate-50',
      'text-slate-100',
      'text-slate-200',
      'text-slate-300',
      'text-gray-50',
      'text-gray-100',
      'text-gray-200',
      'text-gray-300',
      // PetPortrait AI light text colors
      'text-orange-50',
      'text-orange-100',
      'text-orange-200',
      'text-orange-300',
      'text-amber-50',
      'text-amber-100',
      'text-amber-200',
      'text-amber-300',
      'text-coral-50',
      'text-coral-100',
      'text-coral-200',
      'text-coral-300',
      'text-rose-50',
      'text-rose-100',
      'text-rose-200',
      'text-rose-300',
      'text-warm-gray-50',
      'text-warm-gray-100',
      'text-warm-gray-200',
      'text-warm-gray-300',
    ];

    // Dark text colors (for light backgrounds)
    const darkTextColors = [
      'text-black',
      'text-slate-900',
      'text-slate-800',
      'text-slate-700',
      'text-slate-600',
      'text-gray-900',
      'text-gray-800',
      'text-gray-700',
      'text-gray-600',
      // PetPortrait AI dark text colors
      'text-orange-900',
      'text-orange-800',
      'text-orange-700',
      'text-orange-600',
      'text-amber-900',
      'text-amber-800',
      'text-amber-700',
      'text-amber-600',
      'text-coral-900',
      'text-coral-800',
      'text-coral-700',
      'text-coral-600',
      'text-rose-900',
      'text-rose-800',
      'text-rose-700',
      'text-rose-600',
      'text-warm-gray-900',
      'text-warm-gray-800',
      'text-warm-gray-700',
      'text-warm-gray-600',
    ];

    // Heading tags that are affected by globals.css
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    /**
     * Extract className value from JSX attribute
     */
    function getClassNameValue(node) {
      const classAttr = node.attributes.find(
        attr => attr.type === 'JSXAttribute' && attr.name.name === 'className'
      );

      if (!classAttr || !classAttr.value) return null;

      if (classAttr.value.type === 'Literal') {
        return classAttr.value.value;
      }

      if (classAttr.value.type === 'JSXExpressionContainer') {
        const expr = classAttr.value.expression;

        // Handle template literals
        if (expr.type === 'TemplateLiteral') {
          return expr.quasis.map(q => q.value.raw).join(' ');
        }

        // Handle string literals
        if (expr.type === 'Literal') {
          return expr.value;
        }

        // For complex expressions, we can't analyze
        return null;
      }

      return null;
    }

    /**
     * Check if className string contains any of the specified classes
     */
    function hasAnyClass(className, classes) {
      if (!className) return false;
      const classNames = className.split(/\s+/);
      return classes.some(cls => classNames.includes(cls));
    }

    /**
     * Check if element has gradient background
     */
    function hasGradientBackground(className) {
      if (!className) return false;
      return /\b(bg-gradient-|from-|to-|via-)/.test(className);
    }

    /**
     * Check if element already has explicit text color
     */
    function hasExplicitTextColor(className) {
      if (!className) return false;
      const allTextColors = [...lightTextColors, ...darkTextColors];
      return hasAnyClass(className, allTextColors);
    }

    /**
     * Check element and its descendants for contrast issues
     */
    function checkElement(node, ancestorBg = null, insideGradient = false) {
      if (node.type !== 'JSXElement') return;

      const tagName = node.openingElement.name.name;
      const className = getClassNameValue(node.openingElement);

      // Determine background of current element
      let currentBg = ancestorBg;
      const hasDarkBg = hasAnyClass(className, darkBackgrounds);
      const hasLightBg = hasAnyClass(className, lightBackgrounds);

      if (hasDarkBg) currentBg = 'dark';
      if (hasLightBg) currentBg = 'light';

      // Check if this element or any ancestor has gradient background
      const hasGradient = hasGradientBackground(className) || insideGradient;

      // Perform checks if not inside a gradient
      if (!hasGradient) {
        // Check text contrast for heading elements
        if (headingTags.includes(tagName) && currentBg === 'dark') {
          const hasLightText = hasAnyClass(className, lightTextColors);

          if (!hasLightText) {
            // Find which dark background class is used (for better error message)
            const bgClass = darkBackgrounds.find(bg =>
              className && className.includes(bg)
            );

            // Only report if there's an explicit dark background class
            // (not inherited background)
            if (bgClass) {
              context.report({
                node: node.openingElement,
                messageId: 'avoidGlobalCssConflicts',
                data: {
                  tagName,
                  bgClass,
                },
              });
            }
          }
        }

        // Check text contrast for text elements
        if (['p', 'span', 'div', 'a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
          const hasDarkText = hasAnyClass(className, darkTextColors);
          const hasLightText = hasAnyClass(className, lightTextColors);

          // Check if element has EXPLICIT dark background class OR inherited dark background
          if ((hasDarkBg || currentBg === 'dark') && hasDarkText) {
            // Find explicit background class if exists
            const bgClass = hasDarkBg
              ? darkBackgrounds.find(bg => className && className.includes(bg))
              : 'inherited dark background';

            if (bgClass) {
              context.report({
                node: node.openingElement,
                messageId: 'darkBgNeedsLightText',
                data: { bgClass },
              });
            }
          }

          // Check if element has EXPLICIT light background class OR inherited light background
          // Skip if element has its own background (e.g., bg-sky-500, bg-red-500, etc.)
          const hasOwnBackground = className && /\bbg-[a-z]+-\d+/.test(className);
          if ((hasLightBg || currentBg === 'light') && hasLightText && !hasOwnBackground) {
            // Find explicit background class if exists
            const bgClass = hasLightBg
              ? lightBackgrounds.find(bg => className && className.includes(bg))
              : 'inherited light background';

            if (bgClass) {
              context.report({
                node: node.openingElement,
                messageId: 'lightBgNeedsDarkText',
                data: { bgClass },
              });
            }
          }
        }
      }

      // Recursively check children
      if (node.children) {
        node.children.forEach(child => {
          if (child.type === 'JSXElement') {
            checkElement(child, currentBg, hasGradient);
          }
        });
      }
    }

    return {
      JSXElement(node) {
        // Only check root-level elements (let recursion handle nested ones)
        if (
          node.parent.type === 'Program' ||
          node.parent.type === 'ExportDefaultDeclaration' ||
          node.parent.type === 'ReturnStatement' ||
          node.parent.type === 'ArrowFunctionExpression' ||
          node.parent.type === 'FunctionDeclaration'
        ) {
          checkElement(node);
        }
      },
    };
  },
};
