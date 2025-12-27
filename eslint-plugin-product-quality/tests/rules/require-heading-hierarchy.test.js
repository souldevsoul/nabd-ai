/**
 * Tests for require-heading-hierarchy rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-heading-hierarchy');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-heading-hierarchy', rule, {
  valid: [
    // Proper hierarchy H1 → H2 → H3
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>Main Title</h1>
              <h2>Section 1</h2>
              <h3>Subsection 1.1</h3>
              <h2>Section 2</h2>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
    },
    // Going back up is fine (H3 → H2)
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>Title</h1>
              <h2>Section</h2>
              <h3>Subsection</h3>
              <h3>Another Subsection</h3>
              <h2>Next Section</h2>
            </div>
          );
        }
      `,
      filename: '/app/about/page.tsx',
    },
    // Single H1 only
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>Only Title</h1>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
    },
    // Component without H1 is fine
    {
      code: `
        function Card() {
          return (
            <div>
              <h3>Card Title</h3>
              <p>Content</p>
            </div>
          );
        }
      `,
      filename: '/components/Card.tsx',
    },
    // Non-page files are skipped
    {
      code: `
        const config = { heading: 'h1' };
      `,
      filename: '/config/settings.js',
    },
    // Test files are skipped
    {
      code: `
        function Test() {
          return <h1>Test</h1>;
        }
      `,
      filename: '/app/page.test.tsx',
    },
  ],

  invalid: [
    // Skipped level: H1 → H3 (missing H2)
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>Title</h1>
              <h3>Subsection</h3>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
      errors: [
        {
          messageId: 'skippedLevel',
          data: {
            current: 'h3',
            previous: 'h1',
            expected: 'h2',
          },
        },
      ],
    },
    // Skipped level: H2 → H4 (missing H3)
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>Title</h1>
              <h2>Section</h2>
              <h4>Deep Subsection</h4>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
      errors: [
        {
          messageId: 'skippedLevel',
          data: {
            current: 'h4',
            previous: 'h2',
            expected: 'h3',
          },
        },
      ],
    },
    // Multiple H1s
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>First Title</h1>
              <h1>Second Title</h1>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
      errors: [
        {
          messageId: 'multipleH1',
        },
      ],
    },
    // First heading not H1 (in page file)
    {
      code: `
        function Page() {
          return (
            <div>
              <h2>Section Title</h2>
              <h3>Subsection</h3>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
      errors: [
        {
          messageId: 'h1NotFirst',
          data: {
            found: 'h2',
          },
        },
      ],
    },
    // Multiple skipped levels
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>Title</h1>
              <h3>Skipped H2</h3>
              <h6>Skipped H4 and H5</h6>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
      errors: [
        {
          messageId: 'skippedLevel',
          data: {
            current: 'h3',
            previous: 'h1',
            expected: 'h2',
          },
        },
        {
          messageId: 'skippedLevel',
          data: {
            current: 'h6',
            previous: 'h3',
            expected: 'h4',
          },
        },
      ],
    },
  ],
});

console.log('require-heading-hierarchy: All tests passed!');
