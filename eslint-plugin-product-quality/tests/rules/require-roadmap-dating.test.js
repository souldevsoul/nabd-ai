/**
 * Tests for require-roadmap-dating rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-roadmap-dating');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-roadmap-dating', rule, {
  valid: [
    // Non-roadmap file
    {
      code: '<div>Coming soon</div>',
      filename: 'about.tsx',
    },

    // Roadmap with proper quarter dating and last updated
    {
      code: `
        <div>
          <p>Last updated: March 2024</p>
          <h1>Product Roadmap</h1>
          <div>Q1 2024: New features</div>
          <div>Q2 2024: Performance improvements</div>
        </div>
      `,
      filename: 'roadmap.tsx',
    },

    // Changelog with dates
    {
      code: `
        <div>
          <p>Updated on Jan 15, 2024</p>
          <h1>Upcoming Features</h1>
          <p>H1 2024: Major release</p>
        </div>
      `,
      filename: 'changelog.tsx',
    },

    // Coming soon with date
    {
      code: `
        <div>
          <p>As of February 2024</p>
          <h1>Roadmap</h1>
          <p>Coming soon - Q2 2024</p>
        </div>
      `,
      filename: 'roadmap.tsx',
    },
  ],

  invalid: [
    // Roadmap without any dating - expects both errors
    {
      code: `
        <div>
          <h1>Product Roadmap</h1>
          <p>New features planned</p>
        </div>
      `,
      filename: 'roadmap.tsx',
      errors: [
        { messageId: 'missingQuarterDating' },
        { messageId: 'missingLastUpdated' },
      ],
    },

    // Roadmap with vague "coming soon"
    {
      code: `
        <div>
          <h1>Upcoming Features</h1>
          <p>API v2 - Coming soon</p>
          <p>Dark mode - Coming soon</p>
        </div>
      `,
      filename: 'roadmap.tsx',
      errors: [{ messageId: 'vagueComingSoon' }],
    },

    // Roadmap with quarter but no last updated
    {
      code: `
        <div>
          <h1>Product Roadmap</h1>
          <p>Q1 2024: Feature A</p>
          <p>Q2 2024: Feature B</p>
        </div>
      `,
      filename: 'roadmap.tsx',
      errors: [{ messageId: 'missingLastUpdated' }],
    },

    // Features page with "in the future"
    {
      code: `
        <div>
          <h1>Planned Features</h1>
          <p>This will be added in the future</p>
        </div>
      `,
      filename: 'features/upcoming.tsx',
      errors: [{ messageId: 'vagueComingSoon' }],
    },
  ],
});

console.log('✅ require-roadmap-dating: All tests passed');
