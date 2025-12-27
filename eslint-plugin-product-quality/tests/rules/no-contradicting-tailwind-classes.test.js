/**
 * Tests for no-contradicting-tailwind-classes rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-contradicting-tailwind-classes');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-contradicting-tailwind-classes', rule, {
  valid: [
    // Single class is fine
    {
      code: '<div className="flex" />',
      filename: 'test.jsx',
    },

    // Non-contradicting classes
    {
      code: '<div className="flex items-center justify-between" />',
      filename: 'test.jsx',
    },

    // Different responsive variants are fine
    {
      code: '<div className="block md:flex lg:grid" />',
      filename: 'test.jsx',
    },

    // Different state variants are fine
    {
      code: '<div className="opacity-50 hover:opacity-100" />',
      filename: 'test.jsx',
    },

    // Different padding directions are fine
    {
      code: '<div className="pt-4 pb-8 px-6" />',
      filename: 'test.jsx',
    },

    // Width and height together are fine
    {
      code: '<div className="w-full h-screen" />',
      filename: 'test.jsx',
    },

    // Test files are skipped
    {
      code: '<div className="flex block hidden" />',
      filename: 'component.test.jsx',
    },

    // Non-className attributes are ignored
    {
      code: '<div data-class="flex block" />',
      filename: 'test.jsx',
    },
  ],

  invalid: [
    // Contradicting display classes
    {
      code: '<div className="flex block" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Hidden with flex
    {
      code: '<div className="hidden flex items-center" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Multiple position classes
    {
      code: '<div className="relative absolute" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Contradicting text alignment
    {
      code: '<div className="text-left text-center" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Contradicting font weights
    {
      code: '<span className="font-bold font-normal" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Multiple widths (pattern-based)
    {
      code: '<div className="w-full w-1/2" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Multiple heights
    {
      code: '<div className="h-screen h-full" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Duplicate classes
    {
      code: '<div className="mt-4 mt-4" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'duplicate' }],
    },

    // Contradicting flex directions
    {
      code: '<div className="flex-row flex-col" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Template literal with contradictions
    {
      code: '<div className={`flex block ${condition}`} />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Expression with string literal
    {
      code: '<div className={"justify-start justify-end"} />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Multiple padding values for same direction
    {
      code: '<div className="p-4 p-8" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Multiple margin values
    {
      code: '<div className="mt-4 mt-8" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Multiple opacity values
    {
      code: '<div className="opacity-50 opacity-75" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },

    // Multiple z-index values
    {
      code: '<div className="z-10 z-50" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'contradicting' }],
    },
  ],
});

console.log('no-contradicting-tailwind-classes: All tests passed!');
