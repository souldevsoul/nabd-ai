/**
 * ESLint Rule: require-valid-aria-props
 *
 * Validates that all aria-* attributes used in JSX are valid ARIA attributes.
 * Invalid ARIA attributes can break assistive technology support.
 *
 * WCAG 2.1: 4.1.2 Name, Role, Value
 *
 * @version 1.0.0
 * @category Accessibility
 */

// Valid ARIA attributes (WAI-ARIA 1.2 specification)
const VALID_ARIA_PROPS = new Set([
  // Widget attributes
  'aria-autocomplete',
  'aria-checked',
  'aria-disabled',
  'aria-errormessage',
  'aria-expanded',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-label',
  'aria-level',
  'aria-modal',
  'aria-multiline',
  'aria-multiselectable',
  'aria-orientation',
  'aria-placeholder',
  'aria-pressed',
  'aria-readonly',
  'aria-required',
  'aria-selected',
  'aria-sort',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',

  // Live region attributes
  'aria-atomic',
  'aria-busy',
  'aria-live',
  'aria-relevant',

  // Drag-and-drop attributes
  'aria-dropeffect',
  'aria-grabbed',

  // Relationship attributes
  'aria-activedescendant',
  'aria-colcount',
  'aria-colindex',
  'aria-colspan',
  'aria-controls',
  'aria-describedby',
  'aria-description',
  'aria-details',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
  'aria-posinset',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowspan',
  'aria-setsize',

  // Global attributes
  'aria-current',
  'aria-keyshortcuts',
  'aria-roledescription',

  // Deprecated but still valid
  'aria-dropeffect',
  'aria-grabbed',
]);

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require valid aria-* attributes',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      invalidAria: 'Invalid ARIA attribute "{{name}}". Check WAI-ARIA specification for valid attributes.',
      suggestValid: 'Did you mean "{{suggestion}}"?',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')) {
      return {};
    }

    // Skip non-JSX files
    if (!filename.endsWith('.jsx') && !filename.endsWith('.tsx')) {
      return {};
    }

    function findSuggestion(invalidProp) {
      const prop = invalidProp.toLowerCase();
      let bestMatch = null;
      let bestScore = 0;

      for (const valid of VALID_ARIA_PROPS) {
        // Simple similarity check
        let score = 0;
        const validLower = valid.toLowerCase();

        // Check for common typos
        if (prop.includes(validLower.slice(5)) || validLower.includes(prop.slice(5))) {
          score = 0.8;
        }

        // Check Levenshtein-like similarity
        const minLen = Math.min(prop.length, validLower.length);
        let matches = 0;
        for (let i = 0; i < minLen; i++) {
          if (prop[i] === validLower[i]) matches++;
        }
        score = Math.max(score, matches / Math.max(prop.length, validLower.length));

        if (score > bestScore && score > 0.6) {
          bestScore = score;
          bestMatch = valid;
        }
      }

      return bestMatch;
    }

    return {
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier') return;

        const propName = node.name.name;

        // Only check aria-* attributes
        if (!propName.startsWith('aria-')) return;

        // Check if it's a valid ARIA attribute
        if (!VALID_ARIA_PROPS.has(propName)) {
          const suggestion = findSuggestion(propName);

          if (suggestion) {
            context.report({
              node,
              messageId: 'invalidAria',
              data: { name: propName },
            });
          } else {
            context.report({
              node,
              messageId: 'invalidAria',
              data: { name: propName },
            });
          }
        }
      },
    };
  },
};
