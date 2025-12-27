/**
 * Tests for require-consistent-logo rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-consistent-logo');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-consistent-logo', rule, {
  valid: [
    { code: '<Image src="/logo.svg" alt="Logo" />' }, // Single logo
    { code: '<Image src="/images/photo.jpg" alt="Photo" />' }, // Not a logo
    { code: '<div>Content</div>' }, // No Image
    // Icon NOT in logo context (not inside Link href="/") - should pass
    { code: '<div><Sparkles className="h-6 w-6" /></div>' },
    { code: '<Link href="/features"><Star /></Link>' }, // Link to features, not home
  ],
  invalid: [
    // Icon used as logo (inside Link href="/")
    {
      code: '<Link href="/"><Sparkles className="h-8 w-8" /></Link>',
      errors: [{ messageId: 'iconAsLogo' }],
    },
    {
      code: '<Link href="/"><Wand2 className="h-8 w-8" /><span>Brand</span></Link>',
      errors: [{ messageId: 'iconAsLogo' }],
    },
    {
      code: '<Link href="/"><Star className="text-yellow-500" /></Link>',
      errors: [{ messageId: 'iconAsLogo' }],
    },
  ],
});

console.log('All require-consistent-logo tests passed!');
