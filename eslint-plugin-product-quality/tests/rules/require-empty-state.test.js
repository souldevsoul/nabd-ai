/**
 * Tests for require-empty-state rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-empty-state');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-empty-state', rule, {
  valid: [
    { code: 'items.length > 0 && items.map(i => <div key={i.id}>{i.name}</div>)', filename: '/app/page.tsx' },
    { code: 'items?.length ? items.map(i => <div>{i}</div>) : <Empty />', filename: '/app/page.tsx' },
    { code: 'const x = 1;', filename: '/app/api/users/route.ts' }, // API route excluded
  ],
  invalid: [
    {
      code: 'items.map(i => <div key={i.id}>{i.name}</div>)',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'missingEmptyState' }],
    },
  ],
});
