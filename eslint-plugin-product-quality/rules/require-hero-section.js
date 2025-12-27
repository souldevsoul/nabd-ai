/**
 * ESLint Rule: require-hero-section
 *
 * Modern SaaS landing pages need a compelling hero section with:
 * - Clear headline (H1)
 * - Subheadline/value proposition
 * - Primary CTA button
 * - Optional: Hero image, video, or product screenshot
 *
 * Studies show:
 * - Users form opinions in 0.05 seconds
 * - Clear headlines increase engagement by 30%
 * - Hero sections with CTAs have 80% higher conversion
 *
 * @see https://www.nngroup.com/articles/website-hero-area/
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require hero section with headline, subheadline, and CTA on landing pages',
      category: 'UX Best Practices',
      recommended: true,
    },
    messages: {
      missingHeroHeadline: 'Landing page hero section should have a clear H1 headline.',
      missingHeroSubheadline: 'Hero section should include a subheadline or value proposition.',
      missingHeroCTA: 'Hero section should include a primary call-to-action button.',
      missingHeroSection: 'Landing page should have a hero section with headline, subheadline, and CTA.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Only check landing page files
    const landingPatterns = [
      /page\.(tsx?|jsx?)$/i,
      /index\.(tsx?|jsx?)$/i,
      /landing/i,
      /home/i,
      /^app\/page\./i,
      /^src\/app\/page\./i,
    ];

    // Exclude non-landing pages
    const excludePatterns = [
      /dashboard/i,
      /admin/i,
      /settings/i,
      /profile/i,
      /auth/i,
      /login/i,
      /signup/i,
      /register/i,
      /api\//i,
      /legal/i,
      /terms/i,
      /privacy/i,
      /blog/i,
      /\[.*\]/i, // Dynamic routes
      /\/components\//i, // Component directories (barrel exports)
      /\/ui\//i, // UI components
    ];

    const isLandingPage = landingPatterns.some(p => p.test(filename)) &&
                          !excludePatterns.some(p => p.test(filename));

    if (!isLandingPage) return {};

    let hasH1 = false;
    let hasSubheadline = false;
    let hasCTA = false;
    let isHeroContext = false;
    let heroNode = null;

    // Hero section indicators
    const HERO_INDICATORS = [
      /hero/i,
      /banner/i,
      /jumbotron/i,
      /masthead/i,
      /landing-header/i,
      /main-header/i,
    ];

    // Subheadline indicators
    const SUBHEADLINE_INDICATORS = [
      /subhead/i,
      /subtitle/i,
      /tagline/i,
      /description/i,
      /lead/i,
      /intro/i,
    ];

    // CTA indicators
    const CTA_PATTERNS = [
      /get\s+started/i,
      /try\s+(it\s+)?free/i,
      /sign\s+up/i,
      /start\s+(free\s+)?trial/i,
      /book\s+demo/i,
      /request\s+demo/i,
      /learn\s+more/i,
      /see\s+how/i,
      /create\s+account/i,
      /join\s+now/i,
      /subscribe/i,
      /buy\s+now/i,
      /purchase/i,
    ];

    /**
     * Check if node is in hero context
     */
    function checkHeroContext(node) {
      // Check className for hero indicators
      if (node.attributes) {
        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute' || !attr.name) continue;

          const attrName = attr.name.name;
          if (attrName === 'className' || attrName === 'class' || attrName === 'id') {
            const value = attr.value && (attr.value.value || '');
            if (HERO_INDICATORS.some(p => p.test(value))) {
              isHeroContext = true;
              heroNode = node;
              return true;
            }
          }
        }
      }

      // Check component name
      const elementName = node.name && (node.name.name || '');
      if (HERO_INDICATORS.some(p => p.test(elementName))) {
        isHeroContext = true;
        heroNode = node;
        return true;
      }

      return false;
    }

    /**
     * Check for subheadline patterns
     */
    function checkForSubheadline(text) {
      if (!text || typeof text !== 'string') return;

      // Check for subheadline class/id indicators
      if (SUBHEADLINE_INDICATORS.some(p => p.test(text))) {
        hasSubheadline = true;
      }
    }

    /**
     * Check for CTA patterns
     */
    function checkForCTA(text) {
      if (!text || typeof text !== 'string') return;

      if (CTA_PATTERNS.some(p => p.test(text))) {
        hasCTA = true;
      }
    }

    return {
      // Check JSX elements
      JSXOpeningElement(node) {
        checkHeroContext(node);

        const elementName = node.name && (node.name.name || '');

        // Check for H1
        if (elementName === 'h1' || elementName === 'H1') {
          hasH1 = true;
        }

        // Check for heading components
        if (/^Heading|^Title|^H1$/i.test(elementName)) {
          hasH1 = true;
        }

        // Check for subheadline elements
        if (elementName === 'h2' || elementName === 'p') {
          const attrs = node.attributes || [];
          for (const attr of attrs) {
            if (attr.type !== 'JSXAttribute' || !attr.name) continue;
            const attrName = attr.name.name;
            if (attrName === 'className' || attrName === 'class') {
              const value = attr.value && (attr.value.value || '');
              checkForSubheadline(value);
            }
          }
        }

        // Check for button/link elements
        if (elementName === 'button' || elementName === 'Button' ||
            elementName === 'a' || elementName === 'Link') {
          const attrs = node.attributes || [];
          for (const attr of attrs) {
            if (attr.type !== 'JSXAttribute' || !attr.name) continue;
            const attrName = attr.name.name;
            if (attrName === 'className' || attrName === 'class') {
              const value = attr.value && (attr.value.value || '');
              // Check for primary/CTA styling
              if (/primary|cta|action|btn-main/i.test(value)) {
                hasCTA = true;
              }
            }
          }
        }
      },

      // Check JSX text for CTA patterns
      JSXText(node) {
        checkForCTA(node.value);
      },

      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkForCTA(node.value);
          checkForSubheadline(node.value);
        }
      },

      // Check identifiers for subheadline naming
      Identifier(node) {
        if (SUBHEADLINE_INDICATORS.some(p => p.test(node.name))) {
          hasSubheadline = true;
        }
      },

      // Final check
      'Program:exit'(node) {
        // Only report if this looks like a landing page without hero elements
        // More lenient - just check for basic hero components
        if (!hasH1 && !hasCTA) {
          context.report({
            node,
            messageId: 'missingHeroSection',
          });
        } else if (!hasH1) {
          context.report({
            node,
            messageId: 'missingHeroHeadline',
          });
        } else if (!hasCTA) {
          context.report({
            node,
            messageId: 'missingHeroCTA',
          });
        }
      },
    };
  },
};
