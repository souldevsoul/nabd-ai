/**
 * ESLint Rule: no-ai-obvious-content
 *
 * Detects content that appears obviously AI-generated, which damages credibility
 * during payment processor onboarding review.
 *
 * Red flags:
 * - Overuse of AI buzzwords (leverage, seamless, cutting-edge)
 * - Generic marketing phrases (in today's fast-paced, committed to excellence)
 * - Lists always in 5/7/10 items (AI pattern)
 * - Passive voice overuse (is designed to, was created to)
 * - Too formal tone without personality
 *
 * This rule COMPLEMENTS no-fake-content:
 * - no-fake-content: Detects fake names, lorem ipsum, placeholder content
 * - no-ai-obvious-content: Detects generic/template writing style
 *
 * What to do instead:
 * - Add specific numbers and facts
 * - Use contractions (we're, you'll, it's)
 * - Add personal stories and context
 * - Show product specifics
 * - Break perfect structure
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect obviously AI-generated content that damages credibility with payment processors',
      category: 'Content Quality',
      recommended: true,
    },
    messages: {
      aiObviousContent: 'Content appears AI-generated (score: {{score}}/15). Add specific details, numbers, and human voice. Avoid: {{issues}}',
      highBuzzwordDensity: 'High density of AI buzzwords detected ({{count}}). Replace generic terms with specific product details.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          threshold: {
            type: 'number',
            description: 'AI score threshold (0-15). Default: 8',
            default: 8,
          },
          checkPages: {
            type: 'array',
            description: 'Pages to check (default: landing, about, pricing)',
            items: { type: 'string' },
            default: ['page', 'about', 'landing', 'pricing', 'home'],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const threshold = options.threshold || 8;
    const checkPages = options.checkPages || ['page', 'about', 'landing', 'pricing', 'home'];

    // AI buzzwords (common in generic content)
    const AI_BUZZWORDS = [
      'leverage', 'seamless', 'cutting-edge', 'game-changing',
      'innovative', 'revolutionary', 'disruptive', 'transform',
      'unlock', 'harness', 'empower', 'optimize', 'streamline',
      'robust', 'scalable', 'comprehensive', 'holistic',
      'synergy', 'paradigm', 'state-of-the-art', 'world-class',
      'best-in-class', 'industry-leading', 'next-generation',
      'groundbreaking', 'pioneering', 'transformative',
    ];

    // Generic marketing phrases (red flags)
    const GENERIC_PHRASES = [
      'in today\'s fast-paced',
      'our team of experienced',
      'committed to excellence',
      'valued customers',
      'proven track record',
      'industry-leading',
      'state-of-the-art',
      'dedicated to providing',
      'pride ourselves on',
      'strive to deliver',
      'exceptional service',
      'trusted by thousands',
      'years of experience',
      'tailored to your needs',
    ];

    // Passive voice patterns (AI overuses this)
    const PASSIVE_PATTERNS = [
      /\b(is|are|was|were|been|being) (designed|created|built|made|developed|crafted) to\b/gi,
    ];

    // Legal/policy pages are excluded - they need specific terminology
    const excludePatterns = [
      /privacy/i,
      /terms/i,
      /policy/i,
      /cookie/i,
      /refund/i,
      /cancel/i,
      /delivery/i,
      /legal/i,
    ];

    /**
     * Check if filename matches pages we should check
     */
    function shouldCheckFile() {
      const filename = context.getFilename().toLowerCase();
      // Exclude legal/policy pages - they need specific terminology
      if (excludePatterns.some(p => p.test(filename))) {
        return false;
      }
      return checkPages.some(page => filename.includes(page));
    }

    /**
     * Calculate AI likelihood score for text
     */
    function calculateAIScore(text) {
      if (!text || text.length < 50) return 0; // Too short to judge

      let score = 0;
      const issues = [];
      const lowerText = text.toLowerCase();

      // Count buzzwords (+1 each, max +5)
      let buzzwordCount = 0;
      AI_BUZZWORDS.forEach(word => {
        if (lowerText.includes(word.toLowerCase())) {
          buzzwordCount++;
        }
      });
      if (buzzwordCount > 0) {
        const buzzwordScore = Math.min(buzzwordCount, 5);
        score += buzzwordScore;
        issues.push(`${buzzwordCount} buzzwords`);
      }

      // Check generic phrases (+2 each, max +6)
      let genericCount = 0;
      GENERIC_PHRASES.forEach(phrase => {
        if (lowerText.includes(phrase.toLowerCase())) {
          genericCount++;
        }
      });
      if (genericCount > 0) {
        const genericScore = Math.min(genericCount * 2, 6);
        score += genericScore;
        issues.push(`${genericCount} generic phrases`);
      }

      // Check passive voice overuse (+2 if >3 occurrences)
      let passiveCount = 0;
      PASSIVE_PATTERNS.forEach(pattern => {
        const matches = text.match(pattern) || [];
        passiveCount += matches.length;
      });
      if (passiveCount > 3) {
        score += 2;
        issues.push(`${passiveCount} passive voice`);
      }

      // Check list patterns (AI loves lists of 5, 7, 10)
      const listMatches = text.match(/^\s*\d+\./gm) || [];
      if ([5, 7, 10].includes(listMatches.length)) {
        score += 2;
        issues.push(`list of ${listMatches.length} items`);
      }

      return { score, issues };
    }

    /**
     * Check if text has high buzzword density (separate check)
     */
    function checkBuzzwordDensity(text) {
      if (!text || text.length < 100) return { hasProblem: false, count: 0 };

      const words = text.toLowerCase().split(/\s+/);
      const buzzwordCount = words.filter(word =>
        AI_BUZZWORDS.some(buzz => word.includes(buzz.toLowerCase()))
      ).length;

      // If >10% of words are buzzwords, that's suspicious
      const density = buzzwordCount / words.length;
      return {
        hasProblem: density > 0.1,
        count: buzzwordCount,
      };
    }

    return {
      JSXText(node) {
        // Only check relevant pages
        if (!shouldCheckFile()) return;

        const text = node.value.trim();
        if (!text || text.length < 50) return;

        // Skip if it's just a heading or short text
        if (text.length < 100) return;

        // Calculate AI score
        const { score, issues } = calculateAIScore(text);

        if (score >= threshold) {
          context.report({
            node,
            messageId: 'aiObviousContent',
            data: {
              score: score.toString(),
              issues: issues.join(', '),
            },
          });
        }

        // Also check buzzword density separately
        const buzzCheck = checkBuzzwordDensity(text);
        if (buzzCheck.hasProblem) {
          context.report({
            node,
            messageId: 'highBuzzwordDensity',
            data: {
              count: buzzCheck.count.toString(),
            },
          });
        }
      },

      // Check Property nodes for text content in data structures
      Property(node) {
        if (!shouldCheckFile()) return;

        const key = node.key;
        const value = node.value;

        // Check description, content, text properties (NOT testimonial - that's in no-fake-content)
        if (key.type === 'Identifier' &&
            (key.name === 'description' || key.name === 'content' ||
             key.name === 'body' || key.name === 'text')) {

          let text = '';
          if (value.type === 'Literal') {
            text = String(value.value || '');
          } else if (value.type === 'TemplateLiteral') {
            text = value.quasis.map(q => q.value.raw).join(' ');
          }

          if (!text || text.length < 100) return;

          const { score, issues } = calculateAIScore(text);

          if (score >= threshold) {
            context.report({
              node: value,
              messageId: 'aiObviousContent',
              data: {
                score: score.toString(),
                issues: issues.join(', '),
              },
            });
          }
        }
      },
    };
  },
};
