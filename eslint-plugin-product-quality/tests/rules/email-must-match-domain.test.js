/**
 * Tests for email-must-match-domain rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/email-must-match-domain');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('email-must-match-domain', rule, {
  valid: [
    { code: 'const email = "support@myapp.com";', options: [{ domain: 'myapp.com' }] },
    { code: 'const email = "test@example.com";', options: [{ domain: 'myapp.com' }] }, // example.com is excluded
    { code: 'const email = "user@test.com";', options: [{ domain: 'myapp.com' }] }, // test.com is excluded
    { code: 'const text = "Hello world";', options: [{ domain: 'myapp.com' }] }, // No email
    { code: 'const email = "user@gmail.com";' }, // No domain configured - rule disabled
  ],
  invalid: [
    {
      code: 'const email = "support@othersite.com";',
      options: [{ domain: 'myapp.com' }],
      errors: [{ messageId: 'wrongEmailDomain' }],
    },
    {
      code: 'const text = "Contact us at info@wrongdomain.org";',
      options: [{ domain: 'myapp.com' }],
      errors: [{ messageId: 'wrongEmailDomain' }],
    },
  ],
});
