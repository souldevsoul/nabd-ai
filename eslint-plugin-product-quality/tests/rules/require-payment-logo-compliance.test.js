/**
 * Tests for require-payment-logo-compliance rule
 * Ensures payment logos comply with brand guidelines
 * Note: File system checks are skipped in test environment
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-payment-logo-compliance');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-payment-logo-compliance', rule, {
  valid: [
    // Non-payment related code
    { code: 'const x = 1;', filename: '/components/Button.tsx' },

    // Non-payment images (not checked)
    { code: '<Image src="/images/logo.png" alt="Logo" />' },

    // Import from non-react-icons
    { code: 'import { Visa } from "payment-icons";' },
  ],

  invalid: [
    // react-icons imports
    {
      code: 'import { SiVisa } from "react-icons/si";',
      errors: [{ messageId: 'noReactIcons', data: { iconName: 'SiVisa' } }],
    },
    {
      code: 'import { SiMastercard } from "react-icons/si";',
      errors: [{ messageId: 'noReactIcons', data: { iconName: 'SiMastercard' } }],
    },
    {
      code: 'import { FaCcVisa } from "react-icons/fa";',
      errors: [{ messageId: 'noReactIcons', data: { iconName: 'FaCcVisa' } }],
    },
    {
      code: 'import { SiAmericanexpress } from "react-icons/si";',
      errors: [{ messageId: 'noReactIcons', data: { iconName: 'SiAmericanexpress' } }],
    },

    // Wrong path
    {
      code: '<Image src="/assets/visa.svg" alt="Visa" />',
      errors: [{ messageId: 'wrongPath', data: { path: '/assets/visa.svg' } }],
    },
    {
      code: '<Image src="/icons/mastercard.svg" alt="Mastercard" />',
      errors: [{ messageId: 'wrongPath', data: { path: '/icons/mastercard.svg' } }],
    },

    // Wrong format
    {
      code: '<Image src="/images/payments/visa.png" alt="Visa" />',
      errors: [{ messageId: 'wrongFormat', data: { filename: 'visa.png', format: 'PNG' } }],
    },
    {
      code: '<Image src="/images/payments/mastercard.jpg" alt="Mastercard" />',
      errors: [{ messageId: 'wrongFormat', data: { filename: 'mastercard.jpg', format: 'JPG' } }],
    },

    // Data URI
    {
      code: '<Image src="data:image/svg+xml,visa-logo" alt="Visa" />',
      errors: [{ messageId: 'dataUri' }],
    },
  ],
});

console.log('require-payment-logo-compliance: All tests passed!');
