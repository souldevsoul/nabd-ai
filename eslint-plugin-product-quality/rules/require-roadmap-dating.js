/**
 * ESLint Rule: require-roadmap-dating
 *
 * Roadmap pages should have temporal context:
 * - Quarter/year references (Q1 2024, etc.)
 * - "Last updated" timestamp
 * - Avoid evergreen "Coming Soon" without dates
 *
 * This prevents:
 * - Stale roadmaps that hurt credibility
 * - Vague promises without timeline
 * - Payment processor red flags
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require temporal dating on roadmap pages',
      category: 'Content Quality',
      recommended: true,
    },
    messages: {
      missingQuarterDating: 'Roadmap items should have quarter/year dating (e.g., "Q1 2024", "H2 2024").',
      vagueComingSoon: '"Coming Soon" without timeline is vague. Add estimated quarter/date.',
      missingLastUpdated: 'Roadmap page should have "Last updated" timestamp for credibility.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Only check roadmap-related files
    const roadmapPatterns = [
      /roadmap/i,
      /changelog/i,
      /upcoming/i,
      /features/i,
      /releases/i,
    ];

    const isRoadmapFile = roadmapPatterns.some(p => p.test(filename));
    if (!isRoadmapFile) return {};

    let hasQuarterDating = false;
    let hasLastUpdated = false;
    let hasVagueComingSoon = false;
    let isRoadmapContent = false;

    // Roadmap indicators
    const ROADMAP_INDICATORS = [
      /roadmap/i,
      /upcoming/i,
      /planned/i,
      /future/i,
      /in\s+development/i,
    ];

    // Quarter/date patterns
    const QUARTER_PATTERNS = [
      /Q[1-4]\s*['"]?\d{2,4}/i,
      /\b(?:Q1|Q2|Q3|Q4)\b/i,
      /H[12]\s*['"]?\d{2,4}/i,
      /\b20\d{2}\b/,
      /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20\d{2}/i,
      /\b(?:early|mid|late)\s+20\d{2}/i,
      /\bspring|summer|fall|autumn|winter\s+20\d{2}/i,
    ];

    // Last updated patterns
    const LAST_UPDATED_PATTERNS = [
      /last\s+updated/i,
      /updated\s+on/i,
      /as\s+of\s+[A-Z]/i,
      /current\s+as\s+of/i,
    ];

    // Vague "coming soon" patterns
    const VAGUE_PATTERNS = [
      /coming\s+soon(?!\s*[-–:]\s*(?:Q|20|\d))/i,
      /\bsoon\b(?!\s*[-–:]\s*(?:Q|20|\d))/i,
      /in\s+the\s+future\b/i,
      /\beventually\b/i,
    ];

    /**
     * Check for roadmap indicators
     */
    function checkForRoadmapContent(text) {
      if (!text || typeof text !== 'string') return;
      if (ROADMAP_INDICATORS.some(p => p.test(text))) {
        isRoadmapContent = true;
      }
    }

    /**
     * Check for quarter dating
     */
    function checkForQuarterDating(text) {
      if (!text || typeof text !== 'string') return;
      if (QUARTER_PATTERNS.some(p => p.test(text))) {
        hasQuarterDating = true;
      }
    }

    /**
     * Check for last updated
     */
    function checkForLastUpdated(text) {
      if (!text || typeof text !== 'string') return;
      if (LAST_UPDATED_PATTERNS.some(p => p.test(text))) {
        hasLastUpdated = true;
      }
    }

    /**
     * Check for vague coming soon
     */
    function checkForVagueComingSoon(text) {
      if (!text || typeof text !== 'string') return;
      if (VAGUE_PATTERNS.some(p => p.test(text))) {
        hasVagueComingSoon = true;
      }
    }

    /**
     * Check all text
     */
    function checkText(text) {
      checkForRoadmapContent(text);
      checkForQuarterDating(text);
      checkForLastUpdated(text);
      checkForVagueComingSoon(text);
    }

    return {
      // Check JSX text
      JSXText(node) {
        checkText(node.value);
      },

      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkText(node.value);
        }
      },

      // Check identifiers
      Identifier(node) {
        checkText(node.name);
      },

      // Final check
      'Program:exit'(node) {
        // Only check if this appears to be roadmap content
        if (!isRoadmapContent && !/roadmap/i.test(filename)) return;

        // Report vague "coming soon"
        if (hasVagueComingSoon && !hasQuarterDating) {
          context.report({
            node,
            messageId: 'vagueComingSoon',
          });
          return;
        }

        // Report missing quarter dating
        if (!hasQuarterDating) {
          context.report({
            node,
            messageId: 'missingQuarterDating',
          });
        }

        // Report missing last updated
        if (!hasLastUpdated) {
          context.report({
            node,
            messageId: 'missingLastUpdated',
          });
        }
      },
    };
  },
};
