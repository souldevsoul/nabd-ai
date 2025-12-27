/**
 * Tests for require-try-catch-fetch rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-try-catch-fetch');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-try-catch-fetch', rule, {
  valid: [
    {
      code: `async function getData() {
        try {
          const res = await fetch('/api/data');
          return res.json();
        } catch (error) {
          console.error(error);
        }
      }`
    },
    { code: 'const text = "hello";' }, // No fetch
  ],
  invalid: [
    {
      code: 'const res = await fetch("/api/data");',
      errors: [{ messageId: 'missingTryCatch' }],
    },
    {
      code: 'fetch("/api/data").then(r => r.json());',
      errors: [{ messageId: 'missingTryCatch' }],
    },
  ],
});
