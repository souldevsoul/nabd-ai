/**
 * Rule: no-vat-number-display
 * Prohibits displaying VAT numbers (company is not VAT registered)
 *
 * For payment processor compliance, if not VAT registered,
 * VAT number must NOT appear anywhere on the site.
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibit VAT number display (not VAT registered)',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      vatNumberDisplay: 'VAT number display is prohibited. Company is not VAT registered.',
      vatMention: 'VAT/Tax ID mention "{{text}}" should be removed if not VAT registered.',
    },
    schema: [],
  },

  create(context) {
    // VAT number patterns (various EU formats)
    const vatPatterns = [
      // Generic VAT patterns
      /\bVAT\s*(?:number|no|#|ID|reg)?[:\s]*[A-Z]{2}\d{8,12}\b/i,
      /\bVAT[:\s]*[A-Z]{2}[\dA-Z]{8,12}\b/i,
      // Specific country formats
      /\b[A-Z]{2}\d{9,12}\b/, // Generic EU VAT
      /\bGB\d{9}\b/, // UK VAT
      /\bDE\d{9}\b/, // Germany VAT
      /\bFR[\dA-Z]{2}\d{9}\b/, // France VAT
      /\bIT\d{11}\b/, // Italy VAT
      /\bES[\dA-Z]\d{7}[\dA-Z]\b/, // Spain VAT
      /\bNL\d{9}B\d{2}\b/, // Netherlands VAT
      /\bPL\d{10}\b/, // Poland VAT
      /\bBE[01]\d{9}\b/, // Belgium VAT
    ];

    // VAT-related labels that should be checked
    const vatLabels = [
      /\bVAT\s*(?:number|no|#|ID|registration|reg)\b/i,
      /\btax\s*(?:ID|number|registration)\b/i,
      /\bTIN\b/, // Tax Identification Number
      /\bUSt-?IdNr\b/i, // German VAT
      /\bTVA\b/i, // French VAT
      /\bIVA\b/i, // Spanish/Italian VAT
      /\bBTW\b/i, // Dutch VAT
      /\bNIP\b/i, // Polish VAT
    ];

    function checkForVat(node, text) {
      if (!text || typeof text !== 'string') return;

      // Check for actual VAT numbers
      for (const pattern of vatPatterns) {
        if (pattern.test(text)) {
          context.report({
            node,
            messageId: 'vatNumberDisplay',
          });
          return;
        }
      }

      // Check for VAT labels/mentions
      for (const pattern of vatLabels) {
        const match = text.match(pattern);
        if (match) {
          context.report({
            node,
            messageId: 'vatMention',
            data: { text: match[0] },
          });
          return;
        }
      }
    }

    return {
      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkForVat(node, node.value);
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          checkForVat(quasi, quasi.value.raw);
        });
      },

      // Check JSX text
      JSXText(node) {
        checkForVat(node, node.value);
      },

      // Check JSX attributes (labels, placeholders)
      JSXAttribute(node) {
        if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
          checkForVat(node.value, node.value.value);
        }
      },
    };
  },
};
