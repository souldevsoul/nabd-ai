/**
 * Tests for no-console-logs-production rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-console-logs-production');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-console-logs-production', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/app/page.tsx' },
    { code: 'console.error("Error occurred");', filename: '/app/page.tsx' },
    { code: 'console.warn("Warning");', filename: '/app/page.tsx' },
    { code: 'console.log("debug");', filename: '/scripts/build.js' }, // Scripts allowed
  ],
  invalid: [
    {
      code: 'console.log("debug");',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'noConsoleLog' }],
      output: '',
    },
    {
      code: 'console.debug("test");',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'noConsoleLog' }],
      output: '',
    },
  ],
});
