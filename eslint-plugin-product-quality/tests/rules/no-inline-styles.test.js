/**
 * Tests for no-inline-styles rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-inline-styles');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-inline-styles', rule, {
  valid: [
    { code: '<div className="container">Content</div>', filename: '/app/page.tsx' },
    { code: '<span className={styles.text}>Text</span>', filename: '/app/page.tsx' },
    { code: '<div style={{ color: "red" }}>Text</div>', filename: '/app/page.ts' }, // Not tsx/jsx
    { code: '<div style={{ color: "red" }}>Text</div>', filename: '/app/page.test.tsx' }, // Test file excluded
  ],
  invalid: [
    {
      code: '<div style={{ color: "red" }}>Text</div>',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'useClassName' }],
    },
  ],
});
