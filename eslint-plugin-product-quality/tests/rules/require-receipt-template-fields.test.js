/**
 * Tests for require-receipt-template-fields rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-receipt-template-fields');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-receipt-template-fields', rule, {
  valid: [
    { code: '<div>Content</div>', filename: '/app/page.tsx' }, // Not receipt file
    {
      code: '<div><span>Amount: €50 EUR</span><span>Date: 2024-01-01</span><span>Merchant: Company</span><span>Card: Visa ****1234</span><span>Transaction: Purchase</span><span>Description: Product</span><span>support@example.com</span><span>Refund Policy</span><address>Location</address><span>Auth Code: 123456</span></div>',
      filename: '/email-templates/receipt.tsx'
    },
  ],
  invalid: [
    { code: '<div>Receipt</div>', filename: '/email-templates/receipt.tsx', errors: [{ messageId: 'incompleteReceipt' }] },
  ],
});
