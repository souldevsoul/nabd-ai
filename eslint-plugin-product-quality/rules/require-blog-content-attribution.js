/**
 * ESLint Rule: require-blog-content-attribution
 *
 * Blog posts should have proper attribution for credibility:
 * - Author name (or "Team" if no individual author)
 * - Publication date
 * - Optional: Reading time, category
 *
 * This helps with:
 * - SEO (structured data)
 * - Credibility with payment processors
 * - User trust
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require author and date attribution on blog posts',
      category: 'Content Quality',
      recommended: true,
    },
    messages: {
      missingAuthor: 'Blog post missing author attribution. Add author name or "{{ brand }} Team".',
      missingDate: 'Blog post missing publication date. Add date for credibility and SEO.',
      missingBothAttribution: 'Blog post missing both author and date. Add proper attribution for credibility.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Skip non-page files (API routes, components, etc.)
    const skipPatterns = [
      /\/api\//i,
      /\/components\//i,
      /route\.(ts|js)$/i,
      /\.config\./i,
      /\/lib\//i,
      /\/utils\//i,
      /newsletter/i, // Newsletter is not blog content
    ];

    if (skipPatterns.some(p => p.test(filename))) return {};

    // Only check actual blog-related page files (not just any file with "post" in path)
    const blogPatterns = [
      /\/blog\//i,        // /blog/ directory
      /\/articles?\//i,   // /article/ or /articles/
      /\/posts?\//i,      // /post/ or /posts/ directory
      /\/news\//i,        // /news/ directory
    ];

    const isBlogFile = blogPatterns.some(p => p.test(filename));
    if (!isBlogFile) return {};

    let hasAuthor = false;
    let hasDate = false;
    let isBlogContent = false;

    // Patterns indicating this is blog content
    const BLOG_INDICATORS = [
      /\bblog\b/i,
      /\barticle\b/i,
      /\bpost\b/i,
      /BlogPost/i,
      /ArticleCard/i,
    ];

    // Author patterns
    const AUTHOR_PATTERNS = [
      /\bauthor\b/i,
      /\bwriter\b/i,
      /\bby\s+[A-Z][a-z]+/i,
      /written\s+by/i,
      /posted\s+by/i,
      /\bteam\b/i,
    ];

    // Date patterns
    const DATE_PATTERNS = [
      /\bdate\b/i,
      /published/i,
      /posted\s+on/i,
      /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/,
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}/i,
      /\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
      /createdAt/i,
      /publishedAt/i,
      /timestamp/i,
    ];

    /**
     * Check for blog indicators
     */
    function checkForBlogContent(text) {
      if (!text || typeof text !== 'string') return;
      if (BLOG_INDICATORS.some(p => p.test(text))) {
        isBlogContent = true;
      }
    }

    /**
     * Check for author
     */
    function checkForAuthor(text) {
      if (!text || typeof text !== 'string') return;
      if (AUTHOR_PATTERNS.some(p => p.test(text))) {
        hasAuthor = true;
      }
    }

    /**
     * Check for date
     */
    function checkForDate(text) {
      if (!text || typeof text !== 'string') return;
      if (DATE_PATTERNS.some(p => p.test(text))) {
        hasDate = true;
      }
    }

    /**
     * Check all text
     */
    function checkText(text) {
      checkForBlogContent(text);
      checkForAuthor(text);
      checkForDate(text);
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

      // Check JSX elements
      JSXOpeningElement(node) {
        const name = node.name && node.name.name;
        if (name) {
          checkText(name);
        }
      },

      // Check property keys
      Property(node) {
        if (node.key) {
          const keyName = node.key.name || node.key.value;
          if (keyName) {
            checkText(keyName.toString());
          }
        }
      },

      // Final check
      'Program:exit'(node) {
        // Only check if this appears to be blog content
        // For blog directory files, assume it's blog content
        if (!isBlogContent && !/blog/i.test(filename)) return;

        if (!hasAuthor && !hasDate) {
          context.report({
            node,
            messageId: 'missingBothAttribution',
          });
        } else if (!hasAuthor) {
          context.report({
            node,
            messageId: 'missingAuthor',
            data: { brand: 'Your' },
          });
        } else if (!hasDate) {
          context.report({
            node,
            messageId: 'missingDate',
          });
        }
      },
    };
  },
};
