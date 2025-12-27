/**
 * ESLint Rule: require-card-payment-fairness
 *
 * Visa/Mastercard prohibit merchants from setting minimum or maximum
 * transaction amounts for card payments. This is a violation of
 * merchant agreements and can result in account termination.
 *
 * Examples of violations:
 * - "Minimum purchase $10 for card payments"
 * - "Credit card minimum: $5"
 * - "Maximum card transaction: $500"
 * - minAmount={10} or maxAmount={500} props
 *
 * @see Visa Core Rules: Section 5.2.1.1 - Minimum/Maximum Transaction Amount Prohibited
 * @see Mastercard Rules: Section 5.11.1 - Discrimination
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibit minimum/maximum transaction limits for card payments (Visa/MC violation)',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      minTransactionLimit: 'Minimum transaction limits for card payments violate Visa/Mastercard rules. Remove "{{ text }}".',
      maxTransactionLimit: 'Maximum transaction limits for card payments violate Visa/Mastercard rules. Remove "{{ text }}".',
      minAmountProp: 'minAmount prop on payment components violates card network rules. Card payments must not have minimums.',
      maxAmountProp: 'maxAmount prop on payment components violates card network rules. Card payments must not have maximums.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename || '';

    // Only check payment-related files
    const paymentPatterns = [
      /checkout/i,
      /payment/i,
      /pricing/i,
      /cart/i,
      /purchase/i,
      /billing/i,
      /subscribe/i,
    ];

    const isPaymentFile = paymentPatterns.some(p => p.test(filename));
    if (!isPaymentFile) return {};

    // Text patterns that indicate min/max violations
    const MIN_PATTERNS = [
      /minimum\s+(?:purchase|order|transaction|payment|amount).*?\$?\d+/i,
      /min(?:imum)?\s+(?:card|credit|debit).*?\$?\d+/i,
      /(?:card|credit|debit)\s+min(?:imum)?.*?\$?\d+/i,
      /\$\d+\s+min(?:imum)?\s+(?:for|on)\s+(?:card|credit|debit)/i,
      /(?:card|credit|debit)\s+(?:payment|purchase)s?\s+(?:require|need).*?\$?\d+\s+min/i,
    ];

    const MAX_PATTERNS = [
      /maximum\s+(?:purchase|order|transaction|payment|amount).*?\$?\d+/i,
      /max(?:imum)?\s+(?:card|credit|debit).*?\$?\d+/i,
      /(?:card|credit|debit)\s+max(?:imum)?.*?\$?\d+/i,
      /\$\d+\s+max(?:imum)?\s+(?:for|on)\s+(?:card|credit|debit)/i,
      /(?:card|credit|debit)\s+(?:limit|cap).*?\$?\d+/i,
      /transaction\s+limit.*?\$?\d+/i,
    ];

    /**
     * Check text content for violations
     */
    function checkText(node, text) {
      if (!text || typeof text !== 'string') return;

      const trimmedText = text.trim();
      if (trimmedText.length < 10) return;

      for (const pattern of MIN_PATTERNS) {
        const match = trimmedText.match(pattern);
        if (match) {
          context.report({
            node,
            messageId: 'minTransactionLimit',
            data: { text: match[0] },
          });
          return; // One report per node
        }
      }

      for (const pattern of MAX_PATTERNS) {
        const match = trimmedText.match(pattern);
        if (match) {
          context.report({
            node,
            messageId: 'maxTransactionLimit',
            data: { text: match[0] },
          });
          return;
        }
      }
    }

    /**
     * Check for minAmount/maxAmount props on payment components
     */
    function checkPaymentProps(node) {
      if (node.type !== 'JSXOpeningElement') return;

      const elementName = node.name && node.name.name;
      if (!elementName) return;

      // Payment-related component names
      const paymentComponents = [
        /payment/i,
        /checkout/i,
        /stripe/i,
        /paypal/i,
        /card/i,
        /purchase/i,
      ];

      const isPaymentComponent = paymentComponents.some(p => p.test(elementName));
      if (!isPaymentComponent) return;

      const attributes = node.attributes || [];
      for (const attr of attributes) {
        if (attr.type !== 'JSXAttribute' || !attr.name) continue;

        const attrName = attr.name.name;
        if (attrName === 'minAmount' || attrName === 'minimumAmount' || attrName === 'minTransaction') {
          context.report({
            node: attr,
            messageId: 'minAmountProp',
          });
        }
        if (attrName === 'maxAmount' || attrName === 'maximumAmount' || attrName === 'maxTransaction') {
          context.report({
            node: attr,
            messageId: 'maxAmountProp',
          });
        }
      }
    }

    return {
      // Check JSX text content
      JSXText(node) {
        checkText(node, node.value);
      },

      // Check string literals in JSX
      Literal(node) {
        if (typeof node.value === 'string') {
          checkText(node, node.value);
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        const text = node.quasis.map(q => q.value.raw).join('');
        checkText(node, text);
      },

      // Check JSX component props
      JSXOpeningElement(node) {
        checkPaymentProps(node);
      },
    };
  },
};
