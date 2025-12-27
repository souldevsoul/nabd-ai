/**
 * Tests for require-payment-logos-on-page rule
 * Ensures payment logos (Visa/Mastercard) are displayed on pricing/checkout pages
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-payment-logos-on-page');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-payment-logos-on-page', rule, {
  valid: [
    // Non-pricing page - no logos required
    {
      code: 'export default function Home() { return <div>Welcome</div>; }',
      filename: '/app/page.tsx',
    },
    // Pricing page with both logos
    {
      code: `
        export default function Pricing() {
          return (
            <div>
              <Image src="/images/payments/visa.svg" alt="Visa" />
              <Image src="/images/payments/mastercard.svg" alt="Mastercard" />
            </div>
          );
        }
      `,
      filename: '/app/pricing/page.tsx',
    },
    // Checkout page with both logos
    {
      code: `
        export default function Checkout() {
          return (
            <div>
              <img src="/visa-logo.png" alt="Visa" />
              <img src="/mastercard-logo.png" alt="Mastercard" />
            </div>
          );
        }
      `,
      filename: '/app/checkout/page.tsx',
    },
    // Payment page with logos in string literals
    {
      code: `
        const visaLogo = "/images/visa.svg";
        const mastercardLogo = "/images/mastercard.svg";
        export default function Payment() {
          return <div>Payment</div>;
        }
      `,
      filename: '/app/payment/page.tsx',
    },
    // Only Visa required (Mastercard disabled)
    {
      code: `
        export default function Pricing() {
          return <Image src="/visa.svg" alt="Visa" />;
        }
      `,
      filename: '/app/pricing/page.tsx',
      options: [{ requireMastercard: false }],
    },
    // Only Mastercard required (Visa disabled)
    {
      code: `
        export default function Pricing() {
          return <Image src="/mastercard.svg" alt="Mastercard" />;
        }
      `,
      filename: '/app/pricing/page.tsx',
      options: [{ requireVisa: false }],
    },
  ],

  invalid: [
    // Pricing page without any payment logos
    {
      code: 'export default function Pricing() { return <div>Pricing Page</div>; }',
      filename: '/app/pricing/page.tsx',
      errors: [
        { messageId: 'missingVisaLogo' },
        { messageId: 'missingMastercardLogo' },
      ],
    },
    // Checkout page missing Mastercard
    {
      code: `
        export default function Checkout() {
          return <Image src="/images/visa.svg" alt="Visa" />;
        }
      `,
      filename: '/app/checkout/page.tsx',
      errors: [{ messageId: 'missingMastercardLogo' }],
    },
    // Payment page missing Visa
    {
      code: `
        export default function Payment() {
          return <Image src="/images/mastercard.svg" alt="Mastercard" />;
        }
      `,
      filename: '/app/payment/page.tsx',
      errors: [{ messageId: 'missingVisaLogo' }],
    },
    // Subscribe page without logos
    {
      code: 'export default function Subscribe() { return <div>Subscribe</div>; }',
      filename: '/app/subscribe/page.tsx',
      errors: [
        { messageId: 'missingVisaLogo' },
        { messageId: 'missingMastercardLogo' },
      ],
    },
    // Pages path format
    {
      code: 'export default function Pricing() { return <div>Pricing</div>; }',
      filename: '/pages/pricing.tsx',
      errors: [
        { messageId: 'missingVisaLogo' },
        { messageId: 'missingMastercardLogo' },
      ],
    },
  ],
});

console.log('require-payment-logos-on-page: All tests passed!');
