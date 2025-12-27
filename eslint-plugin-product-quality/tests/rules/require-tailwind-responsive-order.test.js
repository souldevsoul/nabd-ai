/**
 * Tests for require-tailwind-responsive-order rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-tailwind-responsive-order');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-tailwind-responsive-order', rule, {
  valid: [
    // Single class
    {
      code: '<div className="flex" />',
      filename: 'test.jsx',
    },

    // Correct mobile-first order
    {
      code: '<div className="text-sm md:text-base lg:text-lg" />',
      filename: 'test.jsx',
    },

    // Base first, then responsive
    {
      code: '<div className="p-4 sm:p-6 md:p-8 lg:p-10" />',
      filename: 'test.jsx',
    },

    // Full correct order
    {
      code: '<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6" />',
      filename: 'test.jsx',
    },

    // Different properties don't need ordering
    {
      code: '<div className="lg:text-lg md:p-4" />',
      filename: 'test.jsx',
    },

    // Only responsive, correct order
    {
      code: '<div className="sm:flex md:block lg:hidden" />',
      filename: 'test.jsx',
    },

    // Non-responsive classes don't matter
    {
      code: '<div className="flex items-center justify-between" />',
      filename: 'test.jsx',
    },

    // Test files skipped
    {
      code: '<div className="lg:text-lg md:text-base sm:text-sm" />',
      filename: 'test.test.jsx',
    },
  ],

  invalid: [
    // Wrong order: lg before md
    {
      code: '<div className="lg:text-lg md:text-base" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'wrongOrder' }],
      output: '<div className="md:text-base lg:text-lg" />',
    },

    // Wrong order: xl before sm
    {
      code: '<div className="xl:p-8 sm:p-4" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'wrongOrder' }],
      output: '<div className="sm:p-4 xl:p-8" />',
    },

    // Wrong order: 2xl before md
    {
      code: '<div className="2xl:w-full md:w-1/2" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'wrongOrder' }],
      output: '<div className="md:w-1/2 2xl:w-full" />',
    },

    // Base should come first
    {
      code: '<div className="md:flex flex" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'wrongOrder' }],
      output: '<div className="flex md:flex" />',
    },

    // Complex wrong order
    {
      code: '<div className="lg:text-lg text-sm md:text-base" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'wrongOrder' }],
      output: '<div className="text-sm md:text-base lg:text-lg" />',
    },
  ],
});

console.log('require-tailwind-responsive-order: All tests passed!');
