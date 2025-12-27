/**
 * Tests for require-faq-section rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-faq-section');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-faq-section', rule, {
  valid: [
    // Non-target page
    {
      code: '<div>Dashboard</div>',
      filename: 'dashboard.tsx',
    },

    // Landing page with FAQ section
    {
      code: `
        <div>
          <h1>Welcome</h1>
          <section className="faq">
            <h2>Frequently Asked Questions</h2>
            <div>Q: How does it work?</div>
          </section>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Pricing page with FAQ
    {
      code: `
        <div>
          <h1>Pricing</h1>
          <div id="faq-section">
            <h2>Common Questions</h2>
          </div>
        </div>
      `,
      filename: 'pricing.tsx',
    },

    // Page with Accordion component
    {
      code: `
        <div>
          <h1>Home</h1>
          <Accordion>
            <AccordionItem>Question 1</AccordionItem>
          </Accordion>
        </div>
      `,
      filename: 'home.tsx',
    },

    // Page with Q&A text
    {
      code: `
        <div>
          <h1>Plans</h1>
          <section>
            <h2>Q&A</h2>
            <p>Have questions? We have answers.</p>
          </section>
        </div>
      `,
      filename: 'plans.tsx',
    },

    // Blog page - should be ignored
    {
      code: '<div>Blog content</div>',
      filename: 'blog/page.tsx',
    },

    // Page with FAQ schema markup
    {
      code: `
        <div>
          <script type="application/ld+json">
            {JSON.stringify({ "@type": "FAQPage", mainEntity: [] })}
          </script>
        </div>
      `,
      filename: 'landing.tsx',
    },
  ],

  invalid: [
    // Landing page without FAQ
    {
      code: `
        <div>
          <h1>Welcome to Our Product</h1>
          <p>The best solution for your needs</p>
          <button>Get Started</button>
        </div>
      `,
      filename: 'app/page.tsx',
      errors: [{ messageId: 'missingFAQ' }],
    },

    // Home page without FAQ
    {
      code: `
        <main>
          <section className="hero">
            <h1>Build Faster</h1>
          </section>
          <section className="features">
            <h2>Features</h2>
          </section>
        </main>
      `,
      filename: 'home.tsx',
      errors: [{ messageId: 'missingFAQ' }],
    },

    // Pricing page without FAQ
    {
      code: `
        <div>
          <h1>Pricing</h1>
          <div className="pricing-cards">
            <div>$9/mo</div>
            <div>$29/mo</div>
          </div>
        </div>
      `,
      filename: 'pricing.tsx',
      errors: [{ messageId: 'missingFAQ' }],
    },
  ],
});

console.log('✅ require-faq-section: All tests passed');
