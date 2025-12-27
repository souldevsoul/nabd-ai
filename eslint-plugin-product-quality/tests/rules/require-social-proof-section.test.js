/**
 * Tests for require-social-proof-section rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-social-proof-section');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-social-proof-section', rule, {
  valid: [
    // Non-target page
    {
      code: '<div>Dashboard content</div>',
      filename: 'dashboard.tsx',
    },

    // Landing page with testimonials
    {
      code: `
        <div>
          <section className="testimonials">
            <h2>What Our Customers Say</h2>
            <p>"Amazing product!" - John</p>
          </section>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Page with company logos
    {
      code: `
        <div>
          <div className="logo-cloud">
            <p>Trusted by leading companies</p>
          </div>
        </div>
      `,
      filename: 'landing.tsx',
    },

    // Page with stats
    {
      code: `
        <div>
          <h1>Welcome</h1>
          <p>Join 10,000+ users worldwide</p>
        </div>
      `,
      filename: 'home.tsx',
    },

    // Page with ratings
    {
      code: `
        <div>
          <span>4.9 star rating on Product Hunt</span>
        </div>
      `,
      filename: 'pricing.tsx',
    },

    // Page with featured mentions
    {
      code: `
        <div>
          <p>As seen in TechCrunch</p>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Page with reviews section class
    {
      code: `
        <section className="reviews-section">
          <Review />
        </section>
      `,
      filename: 'landing.tsx',
    },

    // Blog pages should be ignored
    {
      code: '<div>Blog post content</div>',
      filename: 'blog/page.tsx',
    },
  ],

  invalid: [
    // Landing page without social proof
    {
      code: `
        <div>
          <h1>Welcome to Our Product</h1>
          <p>The best solution for you</p>
          <button>Get Started</button>
        </div>
      `,
      filename: 'app/page.tsx',
      errors: [{ messageId: 'missingSocialProof' }],
    },

    // Home page without any social proof
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
      errors: [{ messageId: 'missingSocialProof' }],
    },

    // Pricing page without social proof
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
      errors: [{ messageId: 'missingSocialProof' }],
    },
  ],
});

console.log('✅ require-social-proof-section: All tests passed');
