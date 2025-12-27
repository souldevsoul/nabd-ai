/**
 * Tests for require-expert-anonymization rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-expert-anonymization');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-expert-anonymization', rule, {
  valid: [
    // Non-marketplace (rule disabled by default)
    {
      code: '<div>Expert: John Smith, john@email.com</div>',
      filename: 'expert-profile.tsx',
    },

    // Marketplace with proper anonymization
    {
      code: `
        <div>
          <p>Expert Profile</p>
          <p>Display Name: John S.</p>
          <p>firstName: "John"</p>
        </div>
      `,
      filename: 'tutor-profile.tsx',
      options: [{ isMarketplace: true }],
    },

    // Marketplace with username system
    {
      code: `
        <div>
          <h1>Tutor Profile</h1>
          <p>Username: TechTutor42</p>
          <p>alias: "MathExpert"</p>
        </div>
      `,
      filename: 'expert-listing.tsx',
      options: [{ isMarketplace: true }],
    },

    // Non-expert file on marketplace
    {
      code: '<div>John Smith</div>',
      filename: 'about.tsx',
      options: [{ isMarketplace: true }],
    },
  ],

  invalid: [
    // Exposed full name on marketplace
    {
      code: `
        <div>
          <h1>Expert Profile</h1>
          <p>John William Smith</p>
        </div>
      `,
      filename: 'expert-profile.tsx',
      options: [{ isMarketplace: true }],
      errors: [{ messageId: 'exposedFullName' }],
    },

    // Exposed email on marketplace
    {
      code: `
        <div>
          <h1>Tutor Profile</h1>
          <p>Contact: tutor@example.com</p>
        </div>
      `,
      filename: 'tutor-listing.tsx',
      options: [{ isMarketplace: true }],
      errors: [{ messageId: 'exposedEmail' }],
    },

    // Exposed phone on marketplace
    {
      code: `
        <div>
          <h1>Freelancer Profile</h1>
          <p>Call: +1 (555) 123-4567</p>
        </div>
      `,
      filename: 'freelancer-profile.tsx',
      options: [{ isMarketplace: true }],
      errors: [{ messageId: 'exposedPhone' }],
    },

    // Missing anonymization strategy - no exposed data, just no strategy
    {
      code: `
        <div>
          <h1>Experts</h1>
          <p>Browse tutors</p>
          <p>Schedule now</p>
        </div>
      `,
      filename: 'expert-listing.tsx',
      options: [{ isMarketplace: true }],
      errors: [{ messageId: 'noAnonymizationStrategy' }],
    },
  ],
});

console.log('✅ require-expert-anonymization: All tests passed');
