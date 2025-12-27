/**
 * ESLint Rule: require-value-proposition
 *
 * Effective landing pages lead with benefits, not features.
 * Value propositions should:
 * - Focus on outcomes ("Save 10 hours/week" not "Has automation")
 * - Be specific and quantified when possible
 * - Address user pain points
 * - Be visible above the fold
 *
 * Studies show benefit-focused copy converts 30% better than feature-focused.
 *
 * @see Copyhackers: Benefits outperform features by 30%+
 * @see Marketing Experiments: Value propositions are #1 conversion factor
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest benefits-focused value proposition on landing pages',
      category: 'UX Best Practices',
      recommended: true,
    },
    messages: {
      missingValueProp: 'Landing page should have a clear value proposition explaining user benefits.',
      featureHeavy: 'Consider leading with user benefits over features. Benefits convert 30% better than features.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Only check landing pages
    const targetPatterns = [
      /^(?:app|src\/app)\/page\./i,
      /landing/i,
      /home/i,
    ];

    const excludePatterns = [
      /dashboard/i,
      /admin/i,
      /settings/i,
      /auth/i,
      /api\//i,
      /blog/i,
      /\[.*\]/i,
    ];

    const isTargetPage = targetPatterns.some(p => p.test(filename)) &&
                         !excludePatterns.some(p => p.test(filename));

    if (!isTargetPage) return {};

    let hasValueProp = false;

    // Value proposition patterns (benefit-focused)
    const VALUE_PROP_PATTERNS = [
      // Time savings
      /save\s+(?:\d+\s+)?(?:hours?|minutes?|time)/i,
      /faster/i,
      /in\s+(?:seconds|minutes)/i,
      /\d+x\s+(?:faster|quicker)/i,

      // Money savings
      /save\s+(?:\$|\€|\£)?\d+/i,
      /cut\s+costs?/i,
      /reduce\s+(?:spend|costs?|expenses?)/i,
      /free\s+(?:trial|plan|tier)/i,

      // Productivity
      /boost\s+(?:productivity|efficiency)/i,
      /increase\s+(?:productivity|output|results)/i,
      /get\s+more\s+done/i,
      /automate/i,
      /streamline/i,

      // Outcomes
      /grow\s+(?:your|revenue|sales|business)/i,
      /increase\s+(?:sales|revenue|conversions?)/i,
      /double\s+(?:your)/i,
      /\d+%\s+(?:increase|growth|improvement)/i,

      // Problem solving
      /stop\s+(?:wasting|losing|struggling)/i,
      /never\s+(?:worry|miss|forget)/i,
      /eliminate/i,
      /without\s+(?:the\s+)?(?:hassle|stress|complexity)/i,
      /no\s+more\s+(?:manual|tedious|repetitive)/i,

      // Simplicity
      /simple/i,
      /easy/i,
      /effortless/i,
      /one[\s-]click/i,
      /instant(?:ly)?/i,

      // Transformation
      /transform/i,
      /revolutionize/i,
      /supercharge/i,
      /level\s+up/i,

      // Value prop indicators
      /value[\s-]prop/i,
      /benefit/i,
      /why\s+(?:choose|use|pick)/i,
      /what\s+you\s+get/i,
    ];

    // Class patterns for value prop sections
    const VALUE_PROP_CLASS_PATTERNS = [
      /value[\s-]*prop/i,
      /benefit/i,
      /advantage/i,
      /hero[\s-]*text/i,
      /headline/i,
      /tagline/i,
    ];

    /**
     * Check text for value proposition
     */
    function checkForValueProp(text) {
      if (!text || typeof text !== 'string') return;
      if (VALUE_PROP_PATTERNS.some(p => p.test(text))) {
        hasValueProp = true;
      }
    }

    /**
     * Check class for value prop sections
     */
    function checkClassForValueProp(className) {
      if (!className || typeof className !== 'string') return;
      if (VALUE_PROP_CLASS_PATTERNS.some(p => p.test(className))) {
        hasValueProp = true;
      }
    }

    return {
      // Check JSX text
      JSXText(node) {
        checkForValueProp(node.value);
      },

      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkForValueProp(node.value);
        }
      },

      // Check classes and component names
      JSXOpeningElement(node) {
        const elementName = node.name && (node.name.name || '');
        checkForValueProp(elementName);

        const attrs = node.attributes || [];
        for (const attr of attrs) {
          if (attr.type !== 'JSXAttribute' || !attr.name) continue;
          const attrName = attr.name.name;

          if (attrName === 'className' || attrName === 'class') {
            const value = attr.value && (attr.value.value || '');
            checkClassForValueProp(value);
          }
        }
      },

      // Check identifiers
      Identifier(node) {
        checkForValueProp(node.name);
      },

      // Final check
      'Program:exit'(node) {
        if (!hasValueProp) {
          context.report({
            node,
            messageId: 'missingValueProp',
          });
        }
      },
    };
  },
};
