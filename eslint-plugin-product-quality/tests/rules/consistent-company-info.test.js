/**
 * Tests for consistent-company-info rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/consistent-company-info');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('consistent-company-info', rule, {
  valid: [
    // Correct company name
    {
      code: 'const company = "MyCompany";',
      options: [{ companyName: 'MyCompany' }],
    },
    // No configuration
    { code: 'const name = "Any Company";' },
  ],

  invalid: [
    // Wrong company name (template leftover)
    {
      code: 'const company = "LogoSmith";',
      options: [{ companyName: 'MyProduct' }],
      errors: [{ messageId: 'wrongCompanyName' }],
    },
    {
      code: '<div>Welcome to VoiceCraft</div>',
      options: [{ companyName: 'MyProduct' }],
      errors: [{ messageId: 'wrongCompanyName' }],
    },
  ],
});

console.log('consistent-company-info: All tests passed!');
