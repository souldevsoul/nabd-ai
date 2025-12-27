/**
 * Tests for require-support-contact-complete rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-support-contact-complete');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-support-contact-complete', rule, {
  valid: [
    {
      code: '<div><a href="tel:+1234567890">+1 234 567 890</a><a href="mailto:support@example.com">Email</a></div>',
      filename: '/components/footer.tsx'
    },
    { code: '<div>Content</div>', filename: '/app/page.tsx' }, // Not footer
  ],
  invalid: [
    { code: '<div>Footer content</div>', filename: '/components/footer.tsx', errors: [{ messageId: 'missingPhone' }, { messageId: 'missingEmail' }] },
  ],
});
