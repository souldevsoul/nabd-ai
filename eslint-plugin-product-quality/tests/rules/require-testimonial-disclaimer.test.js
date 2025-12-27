/**
 * Tests for require-testimonial-disclaimer rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-testimonial-disclaimer');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-testimonial-disclaimer', rule, {
  valid: [
    { code: '<div>Welcome</div>', filename: '/app/page.tsx' },
    { code: '<div>Early Access Feedback</div>', filename: '/components/testimonials.tsx' },
    { code: '<div>Beta tester reviews</div>', filename: '/components/testimonials.tsx' },
  ],
  invalid: [],
});
