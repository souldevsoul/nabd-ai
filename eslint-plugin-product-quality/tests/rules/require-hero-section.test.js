/**
 * Tests for require-hero-section rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-hero-section');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-hero-section', rule, {
  valid: [
    // Non-landing page files should be ignored
    {
      code: '<div>Settings content</div>',
      filename: 'settings.tsx',
    },

    // Dashboard pages ignored
    {
      code: '<div>Dashboard</div>',
      filename: 'dashboard/page.tsx',
    },

    // Landing page with proper hero section
    {
      code: `
        <div className="hero">
          <h1>Transform Your Business</h1>
          <p className="subtitle">The all-in-one platform for modern teams</p>
          <button className="primary">Get Started Free</button>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Landing page with CTA text
    {
      code: `
        <section>
          <h1>Welcome to Our Product</h1>
          <p>Build amazing things faster</p>
          <Link href="/signup">Try it free</Link>
        </section>
      `,
      filename: 'src/app/page.tsx',
    },

    // Home page with proper structure
    {
      code: `
        <main>
          <h1>Powerful Tools for Creators</h1>
          <span>Start your journey today</span>
          <Button>Sign up now</Button>
        </main>
      `,
      filename: 'home.tsx',
    },

    // Auth pages should be ignored
    {
      code: '<div>Login form</div>',
      filename: 'login/page.tsx',
    },

    // Blog pages should be ignored
    {
      code: '<div>Blog content</div>',
      filename: 'blog/page.tsx',
    },
  ],

  invalid: [
    // Landing page missing hero elements
    {
      code: `
        <div>
          <p>Some content without proper hero</p>
        </div>
      `,
      filename: 'app/page.tsx',
      errors: [{ messageId: 'missingHeroSection' }],
    },

    // Landing page with H1 but no CTA
    {
      code: `
        <div>
          <h1>Welcome to Our Site</h1>
          <p>Description here</p>
        </div>
      `,
      filename: 'landing.tsx',
      errors: [{ messageId: 'missingHeroCTA' }],
    },

    // Landing page with CTA but no H1
    {
      code: `
        <div>
          <p>Some description</p>
          <button className="primary">Get Started</button>
        </div>
      `,
      filename: 'home/index.tsx',
      errors: [{ messageId: 'missingHeroHeadline' }],
    },
  ],
});

console.log('✅ require-hero-section: All tests passed');
