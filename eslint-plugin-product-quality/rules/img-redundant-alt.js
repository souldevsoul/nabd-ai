/**
 * ESLint Rule: img-redundant-alt
 *
 * Enforces that img alt attributes do not contain words like "image", "photo",
 * or "picture". Screen readers already announce the element as an image.
 *
 * Based on eslint-plugin-jsx-a11y img-redundant-alt rule.
 *
 * @version 1.27.0
 * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/img-redundant-alt.md
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Image alt text should not contain redundant words like "image", "photo", or "picture"',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      redundantAlt:
        'Alt text contains redundant word "{{word}}". Screen readers already announce images. Describe what the image shows instead.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          words: {
            type: 'array',
            items: { type: 'string' },
            description: 'Additional redundant words to check',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};

    // Default redundant words (case-insensitive)
    const defaultWords = ['image', 'photo', 'picture', 'graphic', 'icon'];
    const redundantWords = [...defaultWords, ...(options.words || [])];

    // Create regex pattern
    const pattern = new RegExp(`\\b(${redundantWords.join('|')})\\b`, 'gi');

    return {
      JSXOpeningElement(node) {
        const elementName = node.name?.name;

        // Check img and Image (Next.js) elements
        if (elementName !== 'img' && elementName !== 'Image') {
          return;
        }

        const attributes = node.attributes || [];

        // Find alt attribute
        const altAttr = attributes.find(
          (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'alt'
        );

        if (!altAttr || !altAttr.value) {
          return;
        }

        // Get alt value
        let altValue = null;
        if (altAttr.value.type === 'Literal') {
          altValue = altAttr.value.value;
        } else if (
          altAttr.value.type === 'JSXExpressionContainer' &&
          altAttr.value.expression?.type === 'Literal'
        ) {
          altValue = altAttr.value.expression.value;
        }

        if (typeof altValue !== 'string') {
          return;
        }

        // Check for redundant words
        const match = altValue.match(pattern);
        if (match) {
          const redundantWord = match[0].toLowerCase();

          context.report({
            node: altAttr,
            messageId: 'redundantAlt',
            data: { word: redundantWord },
            fix(fixer) {
              // Auto-fix: remove redundant words
              const cleanedAlt = altValue
                .replace(pattern, '')
                .replace(/\s+/g, ' ')
                .replace(/^\s*of\s+/i, '') // Remove orphaned "of"
                .replace(/\s*,\s*,/g, ',') // Fix double commas
                .trim();

              if (altAttr.value.type === 'Literal') {
                return fixer.replaceText(altAttr.value, `"${cleanedAlt}"`);
              }
              return null;
            },
          });
        }
      },
    };
  },
};
