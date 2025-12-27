/**
 * ESLint Rule: no-fake-content
 *
 * Detects fake/placeholder content that damages product credibility:
 * - Fake names (John Doe, Jane Smith, Test User)
 * - Placeholder emails (example@example.com, test@test.com)
 * - Lorem ipsum text
 * - Testimonials sections (disallowed until you have real users)
 * - Generic testimonials (too short, generic phrases)
 * - Fake statistics without attribution
 * - Placeholder images (placeholder.jpg, stock photos)
 * - Stock photo indicators
 *
 * This rule ensures the site contains only authentic, real content.
 *
 * @version 2.9
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow fake/placeholder content (fake names, testimonials, Lorem ipsum, placeholder emails)',
      category: 'Content Quality',
      recommended: true,
    },
    messages: {
      fakePersonName: 'Fake person name detected: "{{name}}". Use real names or remove the content.',
      placeholderEmail: 'Placeholder email detected: "{{email}}". Use real contact emails or remove.',
      loremIpsum: 'Lorem ipsum placeholder text detected. Replace with real content.',
      noTestimonials: 'Testimonials section detected. Remove testimonials until you have real users and authentic feedback.',
      genericTestimonial: 'Generic/fake testimonial detected: "{{text}}". Use real customer testimonials or remove.',
      fakeStatistic: 'Suspicious statistic without attribution: "{{stat}}". Add source or remove.',
      placeholderImage: 'Placeholder image detected: "{{src}}". Use real images or branded placeholders.',
      stockPhotoIndicator: 'Stock photo indicator detected: "{{src}}". Use custom photography or licensed images.',
    },
    schema: [],
  },

  create(context) {
    // Fake name patterns
    const fakeNames = [
      'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith',
      'Test User', 'Demo User', 'Example User',
      'User Name', 'First Last', 'Name Surname',
      'Lorem Ipsum', 'Ipsum Lorem',
      'Sample User', 'Placeholder Name',
      'Customer Name', 'Client Name',
      'Your Name', 'Someone',
      'Anonymous', 'Unknown',
      'User 1', 'User 2', 'User 3', 'User One', 'User Two',
      'Person A', 'Person B', 'Person One',
      'Alice Bob', 'Bob Alice', // Common programming examples
      'Foo Bar', 'Bar Foo', // Programming placeholders
    ];

    // Placeholder email patterns (regex)
    const placeholderEmailPatterns = [
      /@example\.com$/i,
      /@test\.com$/i,
      /@domain\.com$/i,
      /@placeholder\.com$/i,
      /@sample\.com$/i,
      /@demo\.com$/i,
      /^test@/i,
      /^demo@/i,
      /^example@/i,
      /^user@/i,
      /^admin@/i,
      /^fake@/i,
      /^noreply@example/i,
      /^user[0-9]+@/i,
      /^test[0-9]+@/i,
    ];

    // Lorem ipsum patterns
    const loremIpsumPatterns = [
      /lorem\s+ipsum/i,
      /dolor\s+sit\s+amet/i,
      /consectetur\s+adipiscing/i,
      /sed\s+do\s+eiusmod/i,
      /tempor\s+incididunt/i,
      /ut\s+labore\s+et\s+dolore/i,
    ];

    // Generic testimonial phrases (always fake)
    const genericTestimonialPhrases = [
      'great product', 'amazing service', 'highly recommend',
      'best tool ever', 'love it', 'awesome',
      '5 stars', 'five stars', '10/10', 'ten out of ten',
      'this is great', 'very good', 'excellent',
      'fantastic', 'wonderful', 'superb',
      'best ever', 'top notch', 'highly satisfied',
      'very satisfied', 'completely satisfied',
    ];

    // Fake statistics patterns (round numbers without context)
    const fakeStatPatterns = [
      /\b10,?000\+?\s*(users?|customers?|clients?)/i,
      /\b100,?000\+?\s*(users?|customers?|clients?)/i,
      /\b1,?000,?000\+?\s*(users?|customers?|clients?)/i,
      /\b99%\s*(satisfaction|happy|satisfied)/i,
      /\b100%\s*(satisfaction|guarantee|secure)/i,
      /\b1M\+?\s*(users?|downloads?)/i,
      /\b10k\+?\s*(users?|customers?)/i,
      /\b100k\+?\s*(users?|customers?)/i,
    ];

    // Placeholder image patterns
    const placeholderImagePatterns = [
      /placeholder\.(jpg|png|svg|gif)/i,
      /avatar-placeholder/i,
      /image-placeholder/i,
      /photo-placeholder/i,
      /picsum\.photos/i,
      /via\.placeholder\.com/i,
      /placehold\.it/i,
      /placeholder\.com/i,
      /dummyimage\.com/i,
      /lorempixel\.com/i,
      /unsplash\.it\/random/i,
      /fillmurray\.com/i,
      /placekitten\.com/i,
    ];

    // Stock photo indicators
    const stockPhotoPatterns = [
      /stock-photo/i,
      /shutterstock/i,
      /gettyimages/i,
      /istockphoto/i,
      /depositphotos/i,
      /123rf/i,
      /dreamstime/i,
      /alamy/i,
    ];

    function checkForFakeNames(text) {
      if (!text || typeof text !== 'string') return false;
      const normalizedText = text.trim();
      return fakeNames.some(fakeName =>
        normalizedText.toLowerCase() === fakeName.toLowerCase()
      );
    }

    function checkForPlaceholderEmail(text) {
      if (!text || typeof text !== 'string') return false;
      return placeholderEmailPatterns.some(pattern => pattern.test(text));
    }

    function checkForLoremIpsum(text) {
      if (!text || typeof text !== 'string') return false;
      return loremIpsumPatterns.some(pattern => pattern.test(text));
    }

    function checkForGenericTestimonial(text, isInTestimonialContext = false) {
      if (!text || typeof text !== 'string') return false;
      const normalizedText = text.toLowerCase().trim();

      // ONLY check if we're in a testimonial context (testimonial property, review component, etc.)
      if (!isInTestimonialContext) {
        return false;
      }

      // Too short (likely fake) - but only if in testimonial context
      if (normalizedText.length < 20 && normalizedText.length > 0) {
        return true;
      }

      // Contains generic phrases
      return genericTestimonialPhrases.some(phrase =>
        normalizedText.includes(phrase)
      );
    }

    function checkForFakeStatistic(text) {
      if (!text || typeof text !== 'string') return false;
      return fakeStatPatterns.some(pattern => pattern.test(text));
    }

    function checkForPlaceholderImage(src) {
      if (!src || typeof src !== 'string') return false;
      return placeholderImagePatterns.some(pattern => pattern.test(src));
    }

    function checkForStockPhoto(src) {
      if (!src || typeof src !== 'string') return false;
      return stockPhotoPatterns.some(pattern => pattern.test(src));
    }

    function extractTextFromNode(node) {
      if (!node) return '';

      if (node.type === 'Literal') {
        return String(node.value || '');
      }

      if (node.type === 'TemplateLiteral') {
        return node.quasis.map(q => q.value.raw).join(' ');
      }

      if (node.type === 'JSXText') {
        return node.value;
      }

      return '';
    }

    return {
      // Check JSX text content - ONLY for Lorem ipsum and fake names, NOT testimonials
      JSXText(node) {
        const text = node.value.trim();
        if (!text) return;

        // Check for fake names (like "John Doe" in testimonials)
        if (checkForFakeNames(text)) {
          context.report({
            node,
            messageId: 'fakePersonName',
            data: { name: text },
          });
        }

        // Check for Lorem ipsum placeholder text
        if (checkForLoremIpsum(text)) {
          context.report({
            node,
            messageId: 'loremIpsum',
          });
        }

        // Check for fake statistics (10,000+ users without attribution)
        if (checkForFakeStatistic(text)) {
          context.report({
            node,
            messageId: 'fakeStatistic',
            data: { stat: text.substring(0, 50) },
          });
        }

        // NOTE: We do NOT check for generic testimonials here
        // because JSXText is too broad - could be button text, descriptions, etc.
        // Only check testimonials in explicit testimonial/review/quote properties
      },

      // Check JSX attributes
      JSXAttribute(node) {
        const attrName = node.name.name;
        const attrValue = node.value;

        if (!attrValue) return;

        // Check href attributes for placeholder emails
        if (attrName === 'href' && attrValue.type === 'Literal') {
          const href = String(attrValue.value);
          if (href.startsWith('mailto:')) {
            const email = href.replace('mailto:', '');
            if (checkForPlaceholderEmail(email)) {
              context.report({
                node,
                messageId: 'placeholderEmail',
                data: { email },
              });
            }
          }
        }

        // Check src attributes for placeholder images
        if (attrName === 'src' && attrValue.type === 'Literal') {
          const src = String(attrValue.value);

          if (checkForPlaceholderImage(src)) {
            context.report({
              node,
              messageId: 'placeholderImage',
              data: { src },
            });
          }

          if (checkForStockPhoto(src)) {
            context.report({
              node,
              messageId: 'stockPhotoIndicator',
              data: { src },
            });
          }
        }

        // Check alt attributes for fake names or generic content
        if (attrName === 'alt' && attrValue.type === 'Literal') {
          const alt = String(attrValue.value);

          if (checkForFakeNames(alt)) {
            context.report({
              node,
              messageId: 'fakePersonName',
              data: { name: alt },
            });
          }
        }
      },

      // Check string literals in object properties (testimonials data)
      Property(node) {
        const key = node.key;
        const value = node.value;

        // Check name properties
        if (key.type === 'Identifier' && key.name === 'name') {
          const text = extractTextFromNode(value);
          if (checkForFakeNames(text)) {
            context.report({
              node: value,
              messageId: 'fakePersonName',
              data: { name: text },
            });
          }
        }

        // Check email properties
        if (key.type === 'Identifier' && key.name === 'email') {
          const text = extractTextFromNode(value);
          if (checkForPlaceholderEmail(text)) {
            context.report({
              node: value,
              messageId: 'placeholderEmail',
              data: { email: text },
            });
          }
        }

        // Check testimonial/review/comment properties (NOT 'text' - too generic)
        if (key.type === 'Identifier' &&
            (key.name === 'testimonial' || key.name === 'review' ||
             key.name === 'comment' || key.name === 'feedback' ||
             key.name === 'quote')) {
          const text = extractTextFromNode(value);

          if (checkForLoremIpsum(text)) {
            context.report({
              node: value,
              messageId: 'loremIpsum',
            });
          }

          // Pass true for isInTestimonialContext since we're in a testimonial property
          if (checkForGenericTestimonial(text, true)) {
            context.report({
              node: value,
              messageId: 'genericTestimonial',
              data: { text: text.substring(0, 50) },
            });
          }
        }

        // Check image/avatar properties
        if (key.type === 'Identifier' &&
            (key.name === 'image' || key.name === 'avatar' ||
             key.name === 'photo' || key.name === 'picture' ||
             key.name === 'src')) {
          const text = extractTextFromNode(value);

          if (checkForPlaceholderImage(text)) {
            context.report({
              node: value,
              messageId: 'placeholderImage',
              data: { src: text },
            });
          }

          if (checkForStockPhoto(text)) {
            context.report({
              node: value,
              messageId: 'stockPhotoIndicator',
              data: { src: text },
            });
          }
        }
      },

      // Check variable declarations for testimonials arrays
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier' &&
            (node.id.name.toLowerCase().includes('testimonial') ||
             node.id.name.toLowerCase().includes('review'))) {
          // Report error - no testimonials allowed until you have real users
          context.report({
            node,
            messageId: 'noTestimonials',
          });
        }
      },
    };
  },
};
