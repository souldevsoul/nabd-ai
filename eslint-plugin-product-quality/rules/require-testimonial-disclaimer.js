/**
 * Rule: require-testimonial-disclaimer
 * Requires disclaimer for test user testimonials
 *
 * Payment processor requirement:
 * - NO fake testimonials pre-launch
 * - Test user feedback must be clearly labeled
 * - Disclaimer required: "From Test Users" or "Early Access Feedback"
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require disclaimer for test user testimonials',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      testimonialWithoutDisclaimer: 'Testimonials section requires disclaimer if using test/beta user feedback. Add "Early Access Feedback" or similar label.',
      suspiciousFakeTestimonial: 'Testimonial may appear fake. Ensure real testimonials or add test user disclaimer.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only check testimonial-related components (not transformation-preview, etc.)
    // Use word boundaries to avoid matching "preview" when looking for "review"
    const fileTestimonialPatterns = [
      /testimonial/i,
      /\breview\b/i,      // Word boundary to avoid matching "preview"
      /\bfeedback\b/i,    // Word boundary to be safe
      /social-proof/i,
    ];

    const isTestimonialFile = fileTestimonialPatterns.some(p => p.test(filename));

    if (!isTestimonialFile) {
      return {};
    }

    let hasTestimonials = false;
    let hasDisclaimer = false;
    let programNode = null;

    // Disclaimer patterns
    const disclaimerPatterns = [
      /test\s*user/i,
      /beta\s*(?:user|tester|feedback)/i,
      /early\s*access/i,
      /closed\s*beta/i,
      /pilot\s*(?:user|program)/i,
      /preview\s*(?:user|feedback)/i,
      /from\s*(?:our\s*)?testers/i,
      /testing\s*phase/i,
    ];

    // Content testimonial indicators (different from file patterns)
    const contentTestimonialPatterns = [
      /testimonial/i,
      /review/i,
      /feedback/i,
      /what\s*(?:our\s*)?(?:customers|users|clients)\s*say/i,
      /customer\s*(?:stories|feedback|reviews)/i,
      /"[^"]{20,}"/, // Quote-like content
      /★|⭐/, // Star ratings
    ];

    // Fake testimonial indicators (should warn)
    const fakePatterns = [
      /lorem\s*ipsum/i,
      /john\s*doe/i,
      /jane\s*doe/i,
      /example\.com/i,
      /test@test/i,
      /acme\s*(?:inc|corp|company)/i,
    ];

    function checkForTestimonials(node, text) {
      if (!text || typeof text !== 'string') return;

      // Check for disclaimers
      for (const pattern of disclaimerPatterns) {
        if (pattern.test(text)) {
          hasDisclaimer = true;
        }
      }

      // Check for testimonial indicators
      for (const pattern of contentTestimonialPatterns) {
        if (pattern.test(text)) {
          hasTestimonials = true;
        }
      }

      // Check for fake testimonial indicators
      for (const pattern of fakePatterns) {
        if (pattern.test(text)) {
          context.report({
            node,
            messageId: 'suspiciousFakeTestimonial',
          });
          return;
        }
      }
    }

    return {
      Program(node) {
        programNode = node;
      },

      Literal(node) {
        if (typeof node.value === 'string') {
          checkForTestimonials(node, node.value);
        }
      },

      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          checkForTestimonials(quasi, quasi.value.raw);
        });
      },

      JSXText(node) {
        checkForTestimonials(node, node.value);
      },

      // Check component names
      JSXOpeningElement(node) {
        if (node.name && node.name.name) {
          const name = node.name.name.toLowerCase();
          if (/testimonial|review|feedback/i.test(name)) {
            hasTestimonials = true;
          }
        }
      },

      'Program:exit'() {
        if (hasTestimonials && !hasDisclaimer && programNode) {
          context.report({
            node: programNode,
            messageId: 'testimonialWithoutDisclaimer',
          });
        }
      },
    };
  },
};
