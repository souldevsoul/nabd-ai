/**
 * Tests for no-wall-of-text rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-wall-of-text');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

// Generate a long text with many words
const longText = 'This is a very long paragraph that goes on and on without any breaks whatsoever. It contains many sentences that could easily be broken up into smaller more digestible chunks. Users typically scan web pages rather than reading every word so having massive blocks of text like this one is generally considered bad practice for user experience and conversion rates. Research shows that scannable content improves usability by forty seven percent and users are much more likely to engage with content that is properly structured with headings bullet points and short paragraphs. This wall of text continues to demonstrate how difficult it is to read unbroken content.';

const shortText = 'This is a short paragraph. It is easy to read.';

ruleTester.run('no-wall-of-text', rule, {
  valid: [
    // Non-target file
    {
      code: `<p>${longText}</p>`,
      filename: 'api/handler.ts',
    },

    // Test file
    {
      code: `<p>${longText}</p>`,
      filename: 'page.test.tsx',
    },

    // Short text
    {
      code: `<p>${shortText}</p>`,
      filename: 'page.tsx',
    },

    // Structured content with multiple short paragraphs
    {
      code: `
        <div>
          <p>First short paragraph with key information.</p>
          <p>Second paragraph provides more detail.</p>
          <ul>
            <li>Bullet point one</li>
            <li>Bullet point two</li>
          </ul>
        </div>
      `,
      filename: 'about.tsx',
    },

    // Normal page content
    {
      code: `
        <section>
          <h1>Welcome</h1>
          <p>Our platform helps you work smarter.</p>
          <p>Get started in minutes.</p>
        </section>
      `,
      filename: 'home/page.tsx',
    },
  ],

  invalid: [
    // Long paragraph text
    {
      code: `<p>${longText}</p>`,
      filename: 'page.tsx',
      errors: [{ messageId: 'wallOfText' }],
    },

    // Long text in string literal
    {
      code: `<p>{"${longText}"}</p>`,
      filename: 'about.tsx',
      errors: [{ messageId: 'wallOfText' }],
    },

    // Long text in template literal
    {
      code: '<p>{`' + longText + '`}</p>',
      filename: 'content.tsx',
      errors: [{ messageId: 'wallOfText' }],
    },
  ],
});

console.log('✅ no-wall-of-text: All tests passed');
