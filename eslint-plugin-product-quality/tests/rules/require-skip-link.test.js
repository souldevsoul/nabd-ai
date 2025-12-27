/**
 * Tests for require-skip-link rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-skip-link');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-skip-link', rule, {
  valid: [
    // Has skip link and main with id
    {
      code: `
        function Layout({ children }) {
          return (
            <html>
              <body>
                <a href="#main-content" className="sr-only">Skip to main content</a>
                <header>Navigation</header>
                <main id="main-content">{children}</main>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },

    // Skip link component
    {
      code: `
        function Layout({ children }) {
          return (
            <html>
              <body>
                <SkipLink />
                <header>Navigation</header>
                <main id="main-content">{children}</main>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },

    // SkipNavigation component
    {
      code: `
        function Layout({ children }) {
          return (
            <html>
              <body>
                <SkipNavigation href="#main" />
                <main id="main">{children}</main>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },

    // Non-layout files are skipped
    {
      code: `
        function Page() {
          return (
            <div>
              <h1>Page</h1>
            </div>
          );
        }
      `,
      filename: '/app/page.tsx',
    },

    // Component files are skipped
    {
      code: `
        function Header() {
          return <header>Header</header>;
        }
      `,
      filename: '/components/Header.tsx',
    },

    // Skip link with #content anchor
    {
      code: `
        function Layout({ children }) {
          return (
            <html>
              <body>
                <a href="#content">Skip</a>
                <div id="content">{children}</div>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },
  ],

  invalid: [
    // Missing skip link
    {
      code: `
        function Layout({ children }) {
          return (
            <html>
              <body>
                <header>Navigation</header>
                <main>{children}</main>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
      errors: [
        { messageId: 'missingSkipLink' },
        { messageId: 'missingMainId' },
      ],
    },

    // Has skip link but main missing id
    {
      code: `
        function Layout({ children }) {
          return (
            <html>
              <body>
                <a href="#main-content">Skip</a>
                <main>{children}</main>
              </body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
      errors: [{ messageId: 'missingMainId' }],
    },

    // Only body, no skip link
    {
      code: `
        function Layout({ children }) {
          return (
            <body>
              <header>Nav</header>
              <div>{children}</div>
            </body>
          );
        }
      `,
      filename: '/components/Layout.tsx',
      errors: [{ messageId: 'missingSkipLink' }],
    },
  ],
});

console.log('require-skip-link: All tests passed!');
