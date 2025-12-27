/**
 * Tests for require-single-cta-focus rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-single-cta-focus');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-single-cta-focus', rule, {
  valid: [
    // Non-landing page
    {
      code: '<div className="hero"><button className="primary">CTA</button><button className="primary">CTA2</button><button className="primary">CTA3</button></div>',
      filename: 'dashboard.tsx',
    },

    // Hero with single CTA
    {
      code: `
        <div className="hero">
          <h1>Welcome</h1>
          <button className="primary">Get Started</button>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Hero with 2 CTAs (default max)
    {
      code: `
        <section className="hero-banner">
          <h1>Welcome</h1>
          <button className="btn-primary">Sign Up</button>
          <button className="cta">Learn More</button>
        </section>
      `,
      filename: 'landing.tsx',
    },

    // Secondary buttons don't count
    {
      code: `
        <div className="hero">
          <button className="primary">Main CTA</button>
          <button className="secondary">Secondary</button>
          <button className="outline">Another</button>
        </div>
      `,
      filename: 'home/index.tsx',
    },

    // No hero section
    {
      code: `
        <div>
          <button className="primary">CTA1</button>
          <button className="primary">CTA2</button>
          <button className="primary">CTA3</button>
        </div>
      `,
      filename: 'page.tsx',
    },
  ],

  invalid: [
    // Hero with too many primary CTAs
    {
      code: `
        <div className="hero">
          <button className="primary">Sign Up</button>
          <button className="btn-primary">Get Started</button>
          <button className="cta">Try Free</button>
        </div>
      `,
      filename: 'app/page.tsx',
      errors: [{ messageId: 'tooManyCTAs' }],
    },

    // Banner with competing CTAs
    {
      code: `
        <section className="banner">
          <button className="bg-blue-500">Option 1</button>
          <button className="bg-indigo-600">Option 2</button>
          <button className="bg-purple-500">Option 3</button>
        </section>
      `,
      filename: 'home.tsx',
      errors: [{ messageId: 'tooManyCTAs' }],
    },
  ],
});

console.log('✅ require-single-cta-focus: All tests passed');
