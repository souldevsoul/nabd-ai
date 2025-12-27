/**
 * Rule: require-receipt-template-fields
 * Ensures receipt/confirmation emails have all required fields
 *
 * Payment processor requirement - Receipt must include:
 * - Authorization code (if provided)
 * - Last 4 digits of card + payment system (Visa/Mastercard)
 * - Amount + currency
 * - Date and time
 * - Merchant name
 * - Website address
 * - Merchant outlet location (physical address)
 * - Transaction type
 * - Product/service description
 * - Support contact (email, phone)
 * - Links to policies
 *
 * @version 1.0.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure receipt templates have all required payment fields',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      missingReceiptField: 'Receipt template missing required field: {{field}}. Add it for payment compliance.',
      incompleteReceipt: 'Receipt template is missing multiple required fields. See payment-compliance-audit.skill for full list.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only check receipt/confirmation email templates
    const isReceiptFile = /receipt|confirmation|invoice|payment-success|order-confirm/i.test(filename) &&
                         /email|template|mail/i.test(filename);

    if (!isReceiptFile) {
      return {};
    }

    // Required fields to check
    const requiredFields = {
      amount: { patterns: [/amount|price|total|sum/i], found: false },
      currency: { patterns: [/currency|EUR|USD|GBP|€|\$|£/], found: false },
      date: { patterns: [/date|time|timestamp/i], found: false },
      merchantName: { patterns: [/merchant|company|business/i, /Ltd|Inc|LLC|GmbH/i], found: false },
      cardInfo: { patterns: [/card|last\s*4|visa|mastercard|payment\s*method/i], found: false },
      transactionType: { patterns: [/transaction|purchase|subscription|payment\s*type/i], found: false },
      description: { patterns: [/description|product|service|item/i], found: false },
      supportEmail: { patterns: [/support|help|contact/i, /@/], found: false },
      policyLinks: { patterns: [/refund|terms|privacy|policy/i], found: false },
      address: { patterns: [/address|location|outlet/i], found: false },
      // NEW in v1.13.0: Authorization code required by Visa/MC
      authorizationCode: { patterns: [/auth(?:orization)?[\s_-]?code/i, /approval[\s_-]?code/i, /reference[\s_-]?(?:number|code|id)/i], found: false },
    };

    let programNode = null;

    function checkForField(text) {
      if (!text || typeof text !== 'string') return;

      for (const [fieldName, field] of Object.entries(requiredFields)) {
        if (!field.found) {
          for (const pattern of field.patterns) {
            if (pattern.test(text)) {
              field.found = true;
              break;
            }
          }
        }
      }
    }

    return {
      Program(node) {
        programNode = node;
      },

      Literal(node) {
        if (typeof node.value === 'string') {
          checkForField(node.value);
        }
      },

      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          checkForField(quasi.value.raw);
        });
      },

      JSXText(node) {
        checkForField(node.value);
      },

      Identifier(node) {
        checkForField(node.name);
      },

      // Check JSX element names
      JSXOpeningElement(node) {
        if (node.name && node.name.name) {
          checkForField(node.name.name);
        }
      },

      // Check object property keys
      Property(node) {
        if (node.key) {
          const keyName = node.key.name || node.key.value;
          if (keyName) {
            checkForField(keyName.toString());
          }
        }
      },

      'Program:exit'() {
        const missingFields = [];

        for (const [fieldName, field] of Object.entries(requiredFields)) {
          if (!field.found) {
            missingFields.push(fieldName);
          }
        }

        if (missingFields.length > 3) {
          context.report({
            node: programNode,
            messageId: 'incompleteReceipt',
          });
        } else if (missingFields.length > 0) {
          for (const field of missingFields) {
            context.report({
              node: programNode,
              messageId: 'missingReceiptField',
              data: { field },
            });
          }
        }
      },
    };
  },
};
