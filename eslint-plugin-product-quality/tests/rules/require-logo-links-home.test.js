/**
 * Tests for require-logo-links-home rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-logo-links-home');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-logo-links-home', rule, {
  valid: [
    { code: 'const x = 1;', filename: '/components/Button.tsx' },
    // Logo link pointing to homepage - valid
    {
      code: '<Link href="/" className="logo"><Image src="/logo.png" alt="Logo" /></Link>',
      filename: '/components/Header.tsx',
    },
    // Logo link with anchor - valid
    {
      code: '<Link href="/#top" className="logo"><Image src="/logo.png" alt="Logo" /></Link>',
      filename: '/app/Header.tsx',
    },
  ],
  invalid: [
    // Logo link not pointing to homepage - should fix
    {
      code: '<Link href="/about" className="logo"><Image src="/logo.png" alt="Logo" /></Link>',
      output: '<Link href="/" className="logo"><Image src="/logo.png" alt="Logo" /></Link>',
      filename: '/components/Header.tsx',
      errors: [{ messageId: 'logoNotHome' }],
    },
  ],
});
