/**
 * Tests for no-fake-testimonials-pre-launch rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-fake-testimonials-pre-launch');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-fake-testimonials-pre-launch', rule, {
  valid: [
    // Non-testimonial file
    {
      code: '<div>Some content</div>',
      filename: 'about.tsx',
    },

    // Testimonials with proper beta label
    {
      code: `
        <div>
          <h2>What our beta testers say</h2>
          <p>"This product is amazing!"</p>
        </div>
      `,
      filename: 'page.tsx',
    },

    // Testimonials with early access label
    {
      code: `
        <section>
          <h2>Customer Reviews</h2>
          <p>Feedback from early access users</p>
          <p>"Great experience so far"</p>
        </section>
      `,
      filename: 'landing.tsx',
    },

    // Testimonials with disclaimer
    {
      code: `
        <div>
          <h2>Testimonials</h2>
          <p>Real user feedback collected during beta</p>
          <blockquote>"Love this tool!"</blockquote>
        </div>
      `,
      filename: 'home.tsx',
    },

    // Pre-launch disabled
    {
      code: `
        <div>
          <h2>Testimonials</h2>
          <p>"Great product!"</p>
        </div>
      `,
      filename: 'page.tsx',
      options: [{ isPreLaunch: false }],
    },
  ],

  invalid: [
    // Testimonials without any label
    {
      code: `
        <div>
          <h2>What our customers say</h2>
          <p>"This product changed my life!"</p>
        </div>
      `,
      filename: 'page.tsx',
      errors: [{ messageId: 'missingTestimonialDisclaimer' }],
    },

    // Reviews section without disclaimer
    {
      code: `
        <section>
          <h2>Customer Reviews</h2>
          <blockquote>"Best tool I've ever used"</blockquote>
        </section>
      `,
      filename: 'landing.tsx',
      errors: [{ messageId: 'missingTestimonialDisclaimer' }],
    },

    // Too many testimonials
    {
      code: `
        const testimonials = [
          { text: "Great!" },
          { text: "Amazing!" },
          { text: "Love it!" },
          { text: "Perfect!" },
          { text: "Awesome!" },
          { text: "Incredible!" },
          { text: "Best ever!" },
        ];
      `,
      filename: 'testimonials.tsx',
      errors: [{ messageId: 'suspiciousTestimonialCount' }],
    },

    // Feedback section without proper labeling
    {
      code: `
        <div>
          <h2>Customer Feedback</h2>
          <p>"Highly recommend this product"</p>
        </div>
      `,
      filename: 'feedback.tsx',
      errors: [{ messageId: 'missingTestimonialDisclaimer' }],
    },
  ],
});

console.log('✅ no-fake-testimonials-pre-launch: All tests passed');
