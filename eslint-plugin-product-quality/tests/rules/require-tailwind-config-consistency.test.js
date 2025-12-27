/**
 * Tests for require-tailwind-config-consistency rule
 * Note: This rule checks file system for Tailwind configuration
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-tailwind-config-consistency');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-tailwind-config-consistency', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/node_modules/package/index.js' }, // node_modules excluded
    { code: 'const x = 1;', filename: '/.next/build/page.js' }, // .next excluded
    { code: 'const x = 1;', filename: '/dist/bundle.js' }, // dist excluded
    { code: 'export default function Page() {}', filename: '/app/page.tsx' }, // Normal file
  ],
  invalid: [
    // Note: Testing actual invalid cases would require mocking the file system
    // The rule checks for postcss.config, globals.css, and tailwind.config files
  ],
});
