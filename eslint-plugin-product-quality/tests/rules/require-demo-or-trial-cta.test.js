/**
 * Tests for require-demo-or-trial-cta rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-demo-or-trial-cta');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-demo-or-trial-cta', rule, {
  valid: [
    // Non-target page
    {
      code: '<div>Dashboard</div>',
      filename: 'dashboard.tsx',
    },

    // Landing page with free trial
    {
      code: `
        <div>
          <h1>Welcome</h1>
          <button>Try it Free</button>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Page with start trial CTA
    {
      code: `
        <div>
          <h1>Get Started</h1>
          <Link href="/signup">Start Free Trial</Link>
        </div>
      `,
      filename: 'landing.tsx',
    },

    // Pricing page with free plan
    {
      code: `
        <div>
          <h1>Pricing</h1>
          <div>
            <h3>Free Plan - $0</h3>
            <p>Free forever</p>
          </div>
        </div>
      `,
      filename: 'pricing.tsx',
    },

    // Page with book demo
    {
      code: `
        <div>
          <h1>Enterprise Solution</h1>
          <button>Book a Demo</button>
        </div>
      `,
      filename: 'home.tsx',
    },

    // Page with watch demo
    {
      code: `
        <div>
          <h1>See Our Product</h1>
          <a href="/demo">Watch Demo</a>
        </div>
      `,
      filename: 'plans.tsx',
    },

    // Page with no credit card required
    {
      code: `
        <div>
          <h1>Start Today</h1>
          <p>No credit card required</p>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Page with interactive demo
    {
      code: `
        <div>
          <h1>Product Tour</h1>
          <InteractiveDemo />
        </div>
      `,
      filename: 'landing.tsx',
    },

    // Blog page - should be ignored
    {
      code: '<div>Blog content</div>',
      filename: 'blog/page.tsx',
    },
  ],

  invalid: [
    // Landing page without trial/demo
    {
      code: `
        <div>
          <h1>Welcome to Our Product</h1>
          <button>Buy Now</button>
        </div>
      `,
      filename: 'app/page.tsx',
      errors: [{ messageId: 'missingTrialOrDemo' }],
    },

    // Pricing page without trial/demo option
    {
      code: `
        <div>
          <h1>Pricing</h1>
          <div>
            <h3>Basic - $9/mo</h3>
          </div>
          <div>
            <h3>Pro - $29/mo</h3>
          </div>
          <button>Subscribe</button>
        </div>
      `,
      filename: 'pricing.tsx',
      errors: [{ messageId: 'missingTrialOrDemo' }],
    },

    // Home page without trial/demo
    {
      code: `
        <main>
          <section className="hero">
            <h1>Build Faster</h1>
            <button>Get Started</button>
          </section>
        </main>
      `,
      filename: 'home.tsx',
      errors: [{ messageId: 'missingTrialOrDemo' }],
    },
  ],
});

console.log('✅ require-demo-or-trial-cta: All tests passed');
