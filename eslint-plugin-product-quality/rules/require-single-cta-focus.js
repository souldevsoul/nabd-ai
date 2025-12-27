/**
 * ESLint Rule: require-single-cta-focus
 *
 * Research shows multiple CTAs decrease conversions by up to 266%.
 * Hero sections should have one clear primary CTA, not multiple competing actions.
 *
 * Best practices:
 * - One primary CTA per hero section
 * - Secondary links (like "Learn more") are OK but should be visually subordinate
 * - Maximum 2 CTAs in hero (primary + secondary)
 *
 * @see Unbounce: Multiple CTAs decrease conversion by 266%
 * @see HubSpot: Single CTA emails have 371% higher click-through rate
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn against multiple competing CTAs in hero sections',
      category: 'UX Best Practices',
      recommended: true,
    },
    messages: {
      tooManyCTAs: 'Hero section has {{ count }} primary CTAs. Research shows multiple CTAs decrease conversion by 266%. Keep to 1-2 max.',
      competingCTAs: 'Multiple equally-styled CTAs compete for attention. Make one clearly primary and others secondary.',
    },
    schema: [{
      type: 'object',
      properties: {
        maxCTAs: {
          type: 'integer',
          default: 2,
          minimum: 1,
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    const options = context.options[0] || {};
    const maxCTAs = options.maxCTAs || 2;

    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Only check landing/home pages
    const landingPatterns = [
      /page\.(tsx?|jsx?)$/i,
      /index\.(tsx?|jsx?)$/i,
      /landing/i,
      /home/i,
    ];

    const excludePatterns = [
      /dashboard/i,
      /admin/i,
      /settings/i,
      /auth/i,
      /api\//i,
      /\[.*\]/i,
    ];

    const isLandingPage = landingPatterns.some(p => p.test(filename)) &&
                          !excludePatterns.some(p => p.test(filename));

    if (!isLandingPage) return {};

    let heroSectionNode = null;
    let primaryCTACount = 0;
    let ctaNodes = [];
    let inHeroSection = false;

    // Hero section indicators
    const HERO_INDICATORS = [
      /\bhero\b/i,
      /\bbanner\b/i,
      /\bjumbotron\b/i,
      /\bmasthead\b/i,
    ];

    // Primary CTA class patterns
    const PRIMARY_CTA_PATTERNS = [
      /\bprimary\b/i,
      /\bbtn-primary\b/i,
      /\bcta\b/i,
      /\bbg-(?:blue|indigo|purple|green|primary)/i,
      /\bbutton-primary\b/i,
      /\bmain-cta\b/i,
    ];

    /**
     * Check if element is in hero context
     */
    function isInHeroContext(className) {
      if (!className) return false;
      return HERO_INDICATORS.some(p => p.test(className));
    }

    /**
     * Check if button has primary styling
     */
    function isPrimaryCTA(className) {
      if (!className) return false;
      return PRIMARY_CTA_PATTERNS.some(p => p.test(className));
    }

    return {
      JSXOpeningElement(node) {
        const elementName = node.name && (node.name.name || '');
        const attrs = node.attributes || [];

        let className = '';
        for (const attr of attrs) {
          if (attr.type !== 'JSXAttribute' || !attr.name) continue;
          const attrName = attr.name.name;
          if (attrName === 'className' || attrName === 'class') {
            className = attr.value && (attr.value.value || '');
          }
        }

        // Track hero section entry
        if (isInHeroContext(className) || HERO_INDICATORS.some(p => p.test(elementName))) {
          inHeroSection = true;
          heroSectionNode = node;
        }

        // Only count CTAs within hero sections or at top level
        if (!inHeroSection) return;

        // Check for button/link elements
        const isButton = elementName === 'button' || elementName === 'Button' ||
                        elementName === 'a' || elementName === 'Link';

        if (isButton && isPrimaryCTA(className)) {
          primaryCTACount++;
          ctaNodes.push(node);
        }
      },

      // Final check
      'Program:exit'(node) {
        if (primaryCTACount > maxCTAs) {
          const reportNode = heroSectionNode || ctaNodes[0] || node;
          context.report({
            node: reportNode,
            messageId: 'tooManyCTAs',
            data: { count: primaryCTACount },
          });
        }
      },
    };
  },
};
