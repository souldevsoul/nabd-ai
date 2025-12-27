/**
 * ESLint Rule: no-contradicting-tailwind-classes
 *
 * Detects contradicting Tailwind CSS classes that cancel each other out.
 *
 * Examples of contradictions:
 * - "flex block" - both set display property
 * - "hidden visible" - both set visibility
 * - "static relative absolute fixed" - multiple position values
 * - "w-full w-1/2" - multiple width values
 *
 * @version 1.0.0
 * @category Tailwind
 */

// Groups of mutually exclusive Tailwind classes
const CONTRADICTING_GROUPS = [
  // Display
  ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden', 'table', 'table-cell', 'table-row', 'flow-root', 'contents'],

  // Position
  ['static', 'relative', 'absolute', 'fixed', 'sticky'],

  // Visibility
  ['visible', 'invisible', 'collapse'],

  // Float
  ['float-left', 'float-right', 'float-none'],

  // Clear
  ['clear-left', 'clear-right', 'clear-both', 'clear-none'],

  // Overflow
  ['overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll', 'overflow-clip'],
  ['overflow-x-auto', 'overflow-x-hidden', 'overflow-x-visible', 'overflow-x-scroll', 'overflow-x-clip'],
  ['overflow-y-auto', 'overflow-y-hidden', 'overflow-y-visible', 'overflow-y-scroll', 'overflow-y-clip'],

  // Text alignment
  ['text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end'],

  // Vertical alignment
  ['align-baseline', 'align-top', 'align-middle', 'align-bottom', 'align-text-top', 'align-text-bottom', 'align-sub', 'align-super'],

  // Font weight
  ['font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'],

  // Font style
  ['italic', 'not-italic'],

  // Text decoration
  ['underline', 'overline', 'line-through', 'no-underline'],

  // Text transform
  ['uppercase', 'lowercase', 'capitalize', 'normal-case'],

  // Whitespace
  ['whitespace-normal', 'whitespace-nowrap', 'whitespace-pre', 'whitespace-pre-line', 'whitespace-pre-wrap', 'whitespace-break-spaces'],

  // Word break
  ['break-normal', 'break-words', 'break-all', 'break-keep'],

  // Flex direction
  ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'],

  // Flex wrap
  ['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'],

  // Justify content
  ['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly', 'justify-stretch'],

  // Align items
  ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'],

  // Align content
  ['content-start', 'content-end', 'content-center', 'content-between', 'content-around', 'content-evenly', 'content-baseline', 'content-stretch'],

  // Align self
  ['self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch', 'self-baseline'],

  // Object fit
  ['object-contain', 'object-cover', 'object-fill', 'object-none', 'object-scale-down'],

  // Object position
  ['object-bottom', 'object-center', 'object-left', 'object-left-bottom', 'object-left-top', 'object-right', 'object-right-bottom', 'object-right-top', 'object-top'],

  // Cursor
  ['cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text', 'cursor-move', 'cursor-help', 'cursor-not-allowed', 'cursor-none', 'cursor-context-menu', 'cursor-progress', 'cursor-cell', 'cursor-crosshair', 'cursor-vertical-text', 'cursor-alias', 'cursor-copy', 'cursor-no-drop', 'cursor-grab', 'cursor-grabbing', 'cursor-all-scroll', 'cursor-col-resize', 'cursor-row-resize', 'cursor-n-resize', 'cursor-e-resize', 'cursor-s-resize', 'cursor-w-resize', 'cursor-ne-resize', 'cursor-nw-resize', 'cursor-se-resize', 'cursor-sw-resize', 'cursor-ew-resize', 'cursor-ns-resize', 'cursor-nesw-resize', 'cursor-nwse-resize', 'cursor-zoom-in', 'cursor-zoom-out'],

  // Pointer events
  ['pointer-events-none', 'pointer-events-auto'],

  // Resize
  ['resize-none', 'resize', 'resize-x', 'resize-y'],

  // User select
  ['select-none', 'select-text', 'select-all', 'select-auto'],

  // List style type
  ['list-none', 'list-disc', 'list-decimal'],

  // List style position
  ['list-inside', 'list-outside'],

  // Border style
  ['border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-hidden', 'border-none'],

  // Table layout
  ['table-auto', 'table-fixed'],

  // Border collapse
  ['border-collapse', 'border-separate'],
];

// Patterns for detecting same-property conflicts (regex based)
const CONFLICT_PATTERNS = [
  // Width conflicts
  { pattern: /^w-/, name: 'width' },
  // Height conflicts
  { pattern: /^h-/, name: 'height' },
  // Min/Max width
  { pattern: /^min-w-/, name: 'min-width' },
  { pattern: /^max-w-/, name: 'max-width' },
  // Min/Max height
  { pattern: /^min-h-/, name: 'min-height' },
  { pattern: /^max-h-/, name: 'max-height' },
  // Padding
  { pattern: /^p-\d/, name: 'padding' },
  { pattern: /^px-/, name: 'padding-x' },
  { pattern: /^py-/, name: 'padding-y' },
  { pattern: /^pt-/, name: 'padding-top' },
  { pattern: /^pr-/, name: 'padding-right' },
  { pattern: /^pb-/, name: 'padding-bottom' },
  { pattern: /^pl-/, name: 'padding-left' },
  // Margin
  { pattern: /^m-\d/, name: 'margin' },
  { pattern: /^mx-/, name: 'margin-x' },
  { pattern: /^my-/, name: 'margin-y' },
  { pattern: /^mt-/, name: 'margin-top' },
  { pattern: /^mr-/, name: 'margin-right' },
  { pattern: /^mb-/, name: 'margin-bottom' },
  { pattern: /^ml-/, name: 'margin-left' },
  // Gap
  { pattern: /^gap-/, name: 'gap' },
  { pattern: /^gap-x-/, name: 'gap-x' },
  { pattern: /^gap-y-/, name: 'gap-y' },
  // Font size
  { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/, name: 'font-size' },
  // Line height
  { pattern: /^leading-/, name: 'line-height' },
  // Letter spacing
  { pattern: /^tracking-/, name: 'letter-spacing' },
  // Z-index
  { pattern: /^z-/, name: 'z-index' },
  // Opacity
  { pattern: /^opacity-/, name: 'opacity' },
  // Border radius
  { pattern: /^rounded($|-)/, name: 'border-radius' },
  // Border width
  { pattern: /^border-(\d|$)/, name: 'border-width' },
  // Shadow
  { pattern: /^shadow($|-)/, name: 'box-shadow' },
  // Transition
  { pattern: /^transition($|-)/, name: 'transition' },
  // Duration
  { pattern: /^duration-/, name: 'transition-duration' },
  // Ease
  { pattern: /^ease-/, name: 'transition-timing' },
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow contradicting Tailwind CSS classes',
      category: 'Tailwind',
      recommended: true,
    },
    messages: {
      contradicting: 'Contradicting Tailwind classes: "{{class1}}" and "{{class2}}" both set {{property}}. Remove one.',
      duplicate: 'Duplicate Tailwind class: "{{className}}" appears multiple times.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')) {
      return {};
    }

    function extractClasses(value) {
      if (typeof value !== 'string') return [];
      return value.split(/\s+/).filter(Boolean);
    }

    function getResponsivePrefix(className) {
      const match = className.match(/^(sm|md|lg|xl|2xl):/);
      return match ? match[1] : '';
    }

    function getStatePrefix(className) {
      const match = className.match(/^(hover|focus|active|disabled|visited|first|last|odd|even|group-hover|dark):/);
      return match ? match[1] : '';
    }

    function stripResponsivePrefix(className) {
      return className.replace(/^(sm|md|lg|xl|2xl):/, '');
    }

    function stripStatePrefix(className) {
      return className.replace(/^(hover|focus|active|disabled|visited|first|last|odd|even|group-hover|dark):/, '');
    }

    function getBaseClass(className) {
      let base = stripResponsivePrefix(className);
      base = stripStatePrefix(base);
      return base;
    }

    function checkForContradictions(classes, node) {
      const baseClasses = classes.map(c => ({
        original: c,
        base: getBaseClass(c),
        responsive: getResponsivePrefix(c),
        state: getStatePrefix(stripResponsivePrefix(c)),
      }));

      // Check for duplicates (same base + same prefix)
      const seen = new Map();
      const duplicates = new Set();
      for (const { original, base, responsive, state } of baseClasses) {
        const key = `${responsive}:${state}:${base}`;
        if (seen.has(key)) {
          context.report({
            node,
            messageId: 'duplicate',
            data: { className: original },
          });
          duplicates.add(key);
        }
        seen.set(key, original);
      }

      // Filter out duplicates from contradiction checking
      const uniqueClasses = baseClasses.filter(({ base, responsive, state }) => {
        const key = `${responsive}:${state}:${base}`;
        return !duplicates.has(key);
      });

      // Only check contradictions for classes with SAME responsive and state prefixes
      // Group by prefix combination (using uniqueClasses to avoid double-reporting duplicates)
      const byPrefix = new Map();
      for (const item of uniqueClasses) {
        const prefixKey = `${item.responsive}:${item.state}`;
        if (!byPrefix.has(prefixKey)) {
          byPrefix.set(prefixKey, []);
        }
        byPrefix.get(prefixKey).push(item);
      }

      // Check contradictions within each prefix group
      for (const [, groupItems] of byPrefix) {
        if (groupItems.length < 2) continue;

        // Check contradicting groups
        for (const group of CONTRADICTING_GROUPS) {
          const foundInGroup = groupItems.filter(({ base }) => group.includes(base));
          if (foundInGroup.length > 1) {
            context.report({
              node,
              messageId: 'contradicting',
              data: {
                class1: foundInGroup[0].original,
                class2: foundInGroup[1].original,
                property: 'the same CSS property',
              },
            });
          }
        }

        // Check pattern-based conflicts
        for (const { pattern, name } of CONFLICT_PATTERNS) {
          const matching = groupItems.filter(({ base }) => pattern.test(base));
          if (matching.length > 1) {
            context.report({
              node,
              messageId: 'contradicting',
              data: {
                class1: matching[0].original,
                class2: matching[1].original,
                property: name,
              },
            });
          }
        }
      }
    }

    return {
      // Check className="..." and class="..."
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        if (node.name.name !== 'className' && node.name.name !== 'class') return;

        const value = node.value;

        // className="static classes"
        if (value && value.type === 'Literal' && typeof value.value === 'string') {
          const classes = extractClasses(value.value);
          if (classes.length > 1) {
            checkForContradictions(classes, node);
          }
        }

        // className={`template ${literal}`}
        if (value && value.type === 'JSXExpressionContainer') {
          const expr = value.expression;

          // Template literal
          if (expr.type === 'TemplateLiteral') {
            const staticParts = expr.quasis.map(q => q.value.raw).join(' ');
            const classes = extractClasses(staticParts);
            if (classes.length > 1) {
              checkForContradictions(classes, node);
            }
          }

          // String literal in expression
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            const classes = extractClasses(expr.value);
            if (classes.length > 1) {
              checkForContradictions(classes, node);
            }
          }
        }
      },
    };
  },
};
