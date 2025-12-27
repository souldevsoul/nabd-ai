/**
 * Tests for require-loading-states rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-loading-states');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-loading-states', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/app/api/users/route.ts' }, // API route excluded
    {
      code: `async function fetchData() {
        try {
          const res = await fetch('/api/data');
          return res.json();
        } catch (e) { console.error(e); }
      }`,
      filename: '/app/page.tsx'
    },
  ],
  invalid: [
    {
      code: 'const data = await fetch("/api/data");',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'missingFetchErrorHandling' }],
    },
  ],
});
