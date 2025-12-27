/**
 * Tests for img-redundant-alt rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/img-redundant-alt');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('img-redundant-alt', rule, {
  valid: [
    // Descriptive alt
    { code: '<img src="/cat.jpg" alt="A fluffy orange cat sleeping on a couch" />' },
    // Empty alt (decorative)
    { code: '<img src="/divider.png" alt="" />' },
    // Next.js Image with good alt
    { code: '<Image src="/hero.jpg" alt="Team members collaborating" />' },
    // Alt without redundant words
    { code: '<img src="/logo.svg" alt="Company logo" />' },
  ],

  invalid: [
    // Contains "image"
    {
      code: '<img src="/cat.jpg" alt="Image of a cat" />',
      output: '<img src="/cat.jpg" alt="a cat" />',
      errors: [{ messageId: 'redundantAlt' }],
    },
    // Contains "photo"
    {
      code: '<img src="/team.jpg" alt="Photo of our team" />',
      output: '<img src="/team.jpg" alt="our team" />',
      errors: [{ messageId: 'redundantAlt' }],
    },
    // Contains "picture"
    {
      code: '<img src="/product.jpg" alt="Picture of the product" />',
      output: '<img src="/product.jpg" alt="the product" />',
      errors: [{ messageId: 'redundantAlt' }],
    },
    // Next.js Image with redundant alt
    {
      code: '<Image src="/hero.jpg" alt="Hero image" />',
      output: '<Image src="/hero.jpg" alt="Hero" />',
      errors: [{ messageId: 'redundantAlt' }],
    },
  ],
});

console.log('img-redundant-alt: All tests passed!');
