/**
 * ESLint Rule: require-lang-attribute
 *
 * Ensures the <html> element has a lang attribute.
 * Required for screen readers to pronounce content correctly.
 *
 * WCAG 2.1 Success Criterion 3.1.1 (Level A): Language of Page
 * - The default human language of each Web page can be programmatically determined
 *
 * In Next.js, this is typically set in:
 * - app/layout.tsx: <html lang="en">
 * - next.config.js: i18n.defaultLocale
 *
 * @version 1.0.0
 * @category Accessibility
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require lang attribute on html element',
      category: 'Accessibility',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      missingLang: '<html> element must have a lang attribute for accessibility. Add lang="en" or appropriate language code.',
      emptyLang: 'lang attribute cannot be empty. Specify a valid language code like "en", "es", "de".',
      invalidLang: 'Invalid lang value "{{lang}}". Use valid BCP 47 language tags like "en", "en-US", "es", "fr".',
    },
    schema: [
      {
        type: 'object',
        properties: {
          defaultLang: {
            type: 'string',
            description: 'Default language code to use in auto-fix',
            default: 'en',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const defaultLang = options.defaultLang || 'en';

    const filename = context.getFilename();

    // Only check layout files where <html> is typically defined
    const isLayoutFile =
      filename.includes('layout.tsx') ||
      filename.includes('layout.jsx') ||
      filename.includes('layout.js') ||
      filename.includes('_document.tsx') ||
      filename.includes('_document.jsx') ||
      filename.includes('_document.js') ||
      filename.includes('_app.tsx') ||
      filename.includes('_app.jsx');

    if (!isLayoutFile) {
      return {};
    }

    // Valid BCP 47 language tag pattern (simplified)
    const validLangPattern = /^[a-z]{2,3}(-[A-Z]{2})?(-[a-zA-Z]+)?$/i;

    return {
      JSXOpeningElement(node) {
        // Check if this is an <html> element
        const name = node.name;
        if (name.type !== 'JSXIdentifier' || name.name !== 'html') {
          return;
        }

        const attributes = node.attributes || [];

        // Find lang attribute
        const langAttr = attributes.find(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name &&
            attr.name.name === 'lang'
        );

        if (!langAttr) {
          // No lang attribute
          context.report({
            node,
            messageId: 'missingLang',
            fix(fixer) {
              // Insert lang attribute after <html
              return fixer.insertTextAfter(node.name, ` lang="${defaultLang}"`);
            },
          });
          return;
        }

        // Check lang value
        let langValue = null;

        if (langAttr.value) {
          if (langAttr.value.type === 'Literal') {
            langValue = langAttr.value.value;
          } else if (
            langAttr.value.type === 'JSXExpressionContainer' &&
            langAttr.value.expression.type === 'Literal'
          ) {
            langValue = langAttr.value.expression.value;
          }
          // Dynamic values (variables) are assumed valid
          else if (langAttr.value.type === 'JSXExpressionContainer') {
            return; // Skip validation for dynamic lang values
          }
        }

        // Empty lang value
        if (langValue === '' || langValue === null) {
          context.report({
            node: langAttr,
            messageId: 'emptyLang',
            fix(fixer) {
              return fixer.replaceText(langAttr, `lang="${defaultLang}"`);
            },
          });
          return;
        }

        // Invalid lang format
        if (typeof langValue === 'string' && !validLangPattern.test(langValue)) {
          context.report({
            node: langAttr,
            messageId: 'invalidLang',
            data: { lang: langValue },
          });
        }
      },
    };
  },
};
