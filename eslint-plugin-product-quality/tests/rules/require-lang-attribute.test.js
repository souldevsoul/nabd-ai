/**
 * Tests for require-lang-attribute rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-lang-attribute');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-lang-attribute', rule, {
  valid: [
    // Proper lang attribute
    {
      code: '<html lang="en"><body></body></html>',
      filename: '/app/layout.tsx',
    },
    {
      code: '<html lang="en-US"><body></body></html>',
      filename: '/app/layout.tsx',
    },
    {
      code: '<html lang="es"><body></body></html>',
      filename: '/app/layout.tsx',
    },
    {
      code: '<html lang="de-DE"><body></body></html>',
      filename: '/app/layout.tsx',
    },
    {
      code: '<html lang="zh-CN"><body></body></html>',
      filename: '/app/layout.tsx',
    },

    // Dynamic lang value (from i18n)
    {
      code: '<html lang={locale}><body></body></html>',
      filename: '/app/layout.tsx',
    },
    {
      code: '<html lang={params.lang}><body></body></html>',
      filename: '/app/layout.tsx',
    },

    // Non-layout files are skipped
    {
      code: '<html><body></body></html>',
      filename: '/components/Test.tsx',
    },
    {
      code: '<html><body></body></html>',
      filename: '/app/page.tsx',
    },

    // _document.tsx
    {
      code: '<html lang="en"><body></body></html>',
      filename: '/pages/_document.tsx',
    },
  ],

  invalid: [
    // Missing lang attribute
    {
      code: '<html><body></body></html>',
      output: '<html lang="en"><body></body></html>',
      filename: '/app/layout.tsx',
      errors: [{ messageId: 'missingLang' }],
    },
    {
      code: '<html className="dark"><body></body></html>',
      output: '<html lang="en" className="dark"><body></body></html>',
      filename: '/app/layout.tsx',
      errors: [{ messageId: 'missingLang' }],
    },

    // Empty lang attribute
    {
      code: '<html lang=""><body></body></html>',
      output: '<html lang="en"><body></body></html>',
      filename: '/app/layout.tsx',
      errors: [{ messageId: 'emptyLang' }],
    },

    // Invalid lang format
    {
      code: '<html lang="english"><body></body></html>',
      filename: '/app/layout.tsx',
      errors: [
        {
          messageId: 'invalidLang',
          data: { lang: 'english' },
        },
      ],
    },
    {
      code: '<html lang="123"><body></body></html>',
      filename: '/app/layout.tsx',
      errors: [
        {
          messageId: 'invalidLang',
          data: { lang: '123' },
        },
      ],
    },

    // _document.tsx without lang
    {
      code: '<html><body></body></html>',
      output: '<html lang="en"><body></body></html>',
      filename: '/pages/_document.tsx',
      errors: [{ messageId: 'missingLang' }],
    },

    // With custom default lang option
    {
      code: '<html><body></body></html>',
      output: '<html lang="es"><body></body></html>',
      filename: '/app/layout.tsx',
      options: [{ defaultLang: 'es' }],
      errors: [{ messageId: 'missingLang' }],
    },
  ],
});

console.log('require-lang-attribute: All tests passed!');
