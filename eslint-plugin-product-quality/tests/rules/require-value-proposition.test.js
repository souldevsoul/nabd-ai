/**
 * Tests for require-value-proposition rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-value-proposition');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-value-proposition', rule, {
  valid: [
    // Non-target page
    {
      code: '<div>Dashboard content</div>',
      filename: 'dashboard.tsx',
    },

    // Landing page with time savings
    {
      code: `
        <div>
          <h1>Save 10 hours every week</h1>
          <p>Automate your workflow</p>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Page with productivity benefit
    {
      code: `
        <section>
          <h1>Boost productivity by 3x</h1>
        </section>
      `,
      filename: 'landing.tsx',
    },

    // Page with simplicity proposition
    {
      code: `
        <div>
          <h1>The simple way to manage projects</h1>
          <p>Get started in seconds</p>
        </div>
      `,
      filename: 'home.tsx',
    },

    // Page with outcomes
    {
      code: `
        <div className="hero-text">
          <h1>Grow your revenue by 50%</h1>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Page with cost savings
    {
      code: `
        <main>
          <h1>Cut costs without cutting quality</h1>
        </main>
      `,
      filename: 'landing.tsx',
    },

    // Page with automation benefit
    {
      code: `
        <div>
          <h1>Automate your marketing</h1>
          <p>No more manual tasks</p>
        </div>
      `,
      filename: 'home.tsx',
    },

    // Page with value prop class
    {
      code: `
        <div className="value-proposition">
          <h1>Welcome to Product</h1>
        </div>
      `,
      filename: 'app/page.tsx',
    },

    // Blog pages should be ignored
    {
      code: '<div>Blog post content</div>',
      filename: 'blog/page.tsx',
    },
  ],

  invalid: [
    // Landing page without value prop
    {
      code: `
        <div>
          <h1>Welcome to Our Platform</h1>
          <p>A great solution for teams</p>
          <button>Sign Up</button>
        </div>
      `,
      filename: 'app/page.tsx',
      errors: [{ messageId: 'missingValueProp' }],
    },

    // Feature-focused copy without benefits
    {
      code: `
        <main>
          <h1>Advanced Analytics Platform</h1>
          <ul>
            <li>Dashboard</li>
            <li>Reports</li>
            <li>API Access</li>
          </ul>
        </main>
      `,
      filename: 'home.tsx',
      errors: [{ messageId: 'missingValueProp' }],
    },

    // Generic landing page
    {
      code: `
        <div>
          <h1>The Next Generation Platform</h1>
          <p>Built for modern businesses</p>
        </div>
      `,
      filename: 'landing.tsx',
      errors: [{ messageId: 'missingValueProp' }],
    },
  ],
});

console.log('✅ require-value-proposition: All tests passed');
