/**
 * ESLint Rule: no-wall-of-text
 *
 * Modern web users scan, don't read. Long paragraphs hurt:
 * - Engagement (users skip long text)
 * - Comprehension (key points get buried)
 * - Conversion (users bounce before CTA)
 *
 * Best practices:
 * - Keep paragraphs under 3-4 sentences
 * - Use bullet points for lists
 * - Break content with headings
 * - Ensure scannable structure
 *
 * Studies show:
 * - 79% of users scan web pages
 * - Scannable content improves usability by 47%
 *
 * @see Nielsen Norman Group: Users scan, don't read
 * @see Baymard Institute: Scannable content increases conversion
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn against long text blocks that hurt readability',
      category: 'UX Best Practices',
      recommended: true,
    },
    messages: {
      wallOfText: 'Long text block detected ({{ words }} words). Consider breaking into shorter paragraphs or bullet points for better scannability.',
      longParagraph: 'Paragraph exceeds {{ words }} words. Break into smaller chunks for better readability.',
    },
    schema: [{
      type: 'object',
      properties: {
        maxWordsPerParagraph: {
          type: 'integer',
          default: 100,
          minimum: 30,
        },
        maxLinesPerBlock: {
          type: 'integer',
          default: 8,
          minimum: 3,
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    const options = context.options[0] || {};
    const maxWords = options.maxWordsPerParagraph || 100;

    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Only check user-facing pages
    const targetPatterns = [
      /page\.(tsx?|jsx?)$/i,
      /\.tsx$/i,
      /\.jsx$/i,
    ];

    const excludePatterns = [
      /api\//i,
      /\.test\./i,
      /\.spec\./i,
      /node_modules/i,
      /config/i,
    ];

    const isTargetFile = targetPatterns.some(p => p.test(filename)) &&
                         !excludePatterns.some(p => p.test(filename));

    if (!isTargetFile) return {};

    /**
     * Count words in text
     */
    function countWords(text) {
      if (!text || typeof text !== 'string') return 0;
      // Remove extra whitespace and count words
      const cleaned = text.trim().replace(/\s+/g, ' ');
      if (!cleaned) return 0;
      return cleaned.split(' ').length;
    }

    /**
     * Check if text is a wall of text
     */
    function isWallOfText(text) {
      const wordCount = countWords(text);
      return wordCount > maxWords;
    }

    return {
      // Check JSX text content
      JSXText(node) {
        const text = node.value;
        const wordCount = countWords(text);

        if (wordCount > maxWords) {
          context.report({
            node,
            messageId: 'wallOfText',
            data: { words: wordCount },
          });
        }
      },

      // Check string literals in JSX (e.g., {`long text`})
      Literal(node) {
        if (typeof node.value !== 'string') return;

        // Only check in JSX context
        const parent = node.parent;
        if (!parent) return;

        // Check if in JSX expression
        const isInJSX = parent.type === 'JSXExpressionContainer' ||
                       parent.type === 'JSXAttribute';

        if (!isInJSX) return;

        const wordCount = countWords(node.value);
        if (wordCount > maxWords) {
          context.report({
            node,
            messageId: 'wallOfText',
            data: { words: wordCount },
          });
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        // Only check in JSX context
        const parent = node.parent;
        if (!parent || parent.type !== 'JSXExpressionContainer') return;

        const text = node.quasis.map(q => q.value.raw).join('');
        const wordCount = countWords(text);

        if (wordCount > maxWords) {
          context.report({
            node,
            messageId: 'wallOfText',
            data: { words: wordCount },
          });
        }
      },
    };
  },
};
