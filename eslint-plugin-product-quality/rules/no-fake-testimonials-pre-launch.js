/**
 * ESLint Rule: no-fake-testimonials-pre-launch
 *
 * Before launch, testimonials should be properly marked as:
 * - "Beta tester feedback"
 * - "Early access user"
 * - "Test user review"
 *
 * This prevents:
 * - Misleading customers
 * - Payment processor rejection
 * - Legal issues with fake endorsements
 *
 * COMPLEMENTS no-fake-content (which catches fake names like "John Doe")
 * This rule focuses on proper labeling of real pre-launch feedback
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require proper labeling of pre-launch testimonials',
      category: 'Content Quality',
      recommended: true,
    },
    messages: {
      unlabeledPreLaunchTestimonial: 'Pre-launch testimonial should be labeled (e.g., "Beta tester", "Early access user"). Add disclaimer.',
      missingTestimonialDisclaimer: 'Testimonials section on pre-launch site should have disclaimer about beta/early user feedback.',
      suspiciousTestimonialCount: 'Too many testimonials ({{ count }}) for a pre-launch product. Consider labeling as beta feedback or reducing count.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxTestimonialsPreLaunch: {
            type: 'number',
            default: 5,
          },
          isPreLaunch: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';
    const options = context.options[0] || {};
    const maxTestimonials = options.maxTestimonialsPreLaunch || 5;
    const isPreLaunch = options.isPreLaunch !== false;

    // Only check if pre-launch mode is enabled
    if (!isPreLaunch) return {};

    // Check testimonial-related files or main pages
    const testimonialPatterns = [
      /testimonial/i,
      /review/i,
      /feedback/i,
      /page\./i,
      /landing/i,
      /home/i,
    ];

    // Exclude component directories and internal files
    const excludePatterns = [
      /\/components\//i,
      /\/ui\//i,
      /admin/i,
      /dashboard/i,
      /api\//i,
      /policy/i, // Legal/policy pages
      /terms/i,
      /privacy/i,
      /cookie/i,
      /about/i,
      /features/i,
      /refund/i,
      /contact/i, // Contact page is not testimonials
      /pricing/i, // Pricing page
      /demo/i, // Demo page
      /signup/i, // Signup page
      /login/i, // Login page
      /faq/i, // FAQ page
    ];

    const isRelevantFile = testimonialPatterns.some(p => p.test(filename)) &&
                           !excludePatterns.some(p => p.test(filename));
    if (!isRelevantFile) return {};

    let testimonialCount = 0;
    let hasProperLabel = false;
    let hasDisclaimer = false;
    let hasTestimonialSection = false;

    // Testimonial indicators
    const TESTIMONIAL_INDICATORS = [
      /testimonial/i,
      /review/i,
      /feedback/i,
      /\bsaid\b/i,
      /what.*customers.*say/i,
      /customer.*stories/i,
    ];

    // Proper label patterns
    const PROPER_LABEL_PATTERNS = [
      /beta\s*tester/i,
      /early\s*access/i,
      /early\s*adopter/i,
      /test\s*user/i,
      /founding\s*member/i,
      /pre-?launch/i,
      /alpha\s*user/i,
      /pilot\s*user/i,
    ];

    // Disclaimer patterns
    const DISCLAIMER_PATTERNS = [
      /beta\s*feedback/i,
      /early\s*user\s*reviews/i,
      /real\s*(?:beta\s*)?user\s*feedback/i,
      /feedback\s*from\s*(?:beta|early)/i,
      /results\s*may\s*vary/i,
      /collected\s*during\s*beta/i,
    ];

    // Quote/testimonial patterns
    const QUOTE_PATTERNS = [
      /"[^"]{20,}"/,
      /'[^']{20,}'/,
      /«[^»]{20,}»/,
    ];

    /**
     * Check for testimonial section
     */
    function checkForTestimonialSection(text) {
      if (!text || typeof text !== 'string') return;
      if (TESTIMONIAL_INDICATORS.some(p => p.test(text))) {
        hasTestimonialSection = true;
      }
    }

    /**
     * Check for proper labels
     */
    function checkForProperLabel(text) {
      if (!text || typeof text !== 'string') return;
      if (PROPER_LABEL_PATTERNS.some(p => p.test(text))) {
        hasProperLabel = true;
      }
    }

    /**
     * Check for disclaimer
     */
    function checkForDisclaimer(text) {
      if (!text || typeof text !== 'string') return;
      if (DISCLAIMER_PATTERNS.some(p => p.test(text))) {
        hasDisclaimer = true;
      }
    }

    /**
     * Check for testimonial quotes
     */
    function checkForQuotes(text) {
      if (!text || typeof text !== 'string') return;
      for (const pattern of QUOTE_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
          testimonialCount += matches.length;
        }
      }
    }

    /**
     * Check all text
     */
    function checkText(text) {
      checkForTestimonialSection(text);
      checkForProperLabel(text);
      checkForDisclaimer(text);
      checkForQuotes(text);
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

      // Check for testimonial components/arrays
      ArrayExpression(node) {
        // Check if parent suggests this is a testimonials array
        const parent = node.parent;
        if (parent && parent.type === 'VariableDeclarator' && parent.id) {
          const varName = parent.id.name || '';
          if (/testimonial|review|feedback/i.test(varName)) {
            testimonialCount += node.elements.length;
          }
        }
      },

      // Final check
      'Program:exit'(node) {
        // Only report if testimonial section detected
        if (!hasTestimonialSection && testimonialCount === 0) return;

        // Too many testimonials for pre-launch
        if (testimonialCount > maxTestimonials) {
          context.report({
            node,
            messageId: 'suspiciousTestimonialCount',
            data: { count: testimonialCount },
          });
          return;
        }

        // Has testimonials but no proper labeling
        if (hasTestimonialSection && !hasProperLabel && !hasDisclaimer) {
          context.report({
            node,
            messageId: 'missingTestimonialDisclaimer',
          });
        }
      },
    };
  },
};
