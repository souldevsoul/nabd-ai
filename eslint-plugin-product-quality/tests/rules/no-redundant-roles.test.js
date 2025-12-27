/**
 * Tests for no-redundant-roles rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-redundant-roles');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-redundant-roles', rule, {
  valid: [
    // No role attribute - fine
    {
      code: '<button>Click me</button>',
      filename: 'test.jsx',
    },

    // Different role is fine
    {
      code: '<div role="button">Div button</div>',
      filename: 'test.jsx',
    },

    // Non-redundant role on link (without href, no implicit role)
    {
      code: '<a role="button">Button-like anchor</a>',
      filename: 'test.jsx',
    },

    // Custom components are skipped
    {
      code: '<Button role="button">Custom</Button>',
      filename: 'test.jsx',
    },
    {
      code: '<MyNav role="navigation">Custom nav</MyNav>',
      filename: 'test.jsx',
    },

    // Test files are skipped
    {
      code: '<button role="button">Test</button>',
      filename: 'component.test.jsx',
    },

    // Non-JSX files are skipped
    {
      code: 'const x = "button";',
      filename: 'test.js',
    },

    // Different element-role combinations
    {
      code: '<nav role="menu">Menu nav</nav>',
      filename: 'test.jsx',
    },
    {
      code: '<button role="switch">Toggle</button>',
      filename: 'test.jsx',
    },
  ],

  invalid: [
    // Redundant role="button" on <button>
    {
      code: '<button role="button">Click</button>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'button', element: 'button' } }],
      output: '<button>Click</button>',
    },

    // Redundant role="link" on <a href>
    {
      code: '<a href="/page" role="link">Link</a>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'link', element: 'a' } }],
      output: '<a href="/page">Link</a>',
    },

    // Redundant role="navigation" on <nav>
    {
      code: '<nav role="navigation">Nav</nav>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'navigation', element: 'nav' } }],
      output: '<nav>Nav</nav>',
    },

    // Redundant role="main" on <main>
    {
      code: '<main role="main">Content</main>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'main', element: 'main' } }],
      output: '<main>Content</main>',
    },

    // Redundant role="img" on <img>
    {
      code: '<img src="pic.jpg" alt="Picture" role="img" />',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'img', element: 'img' } }],
      output: '<img src="pic.jpg" alt="Picture" />',
    },

    // Redundant role="list" on <ul>
    {
      code: '<ul role="list"><li>Item</li></ul>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'list', element: 'ul' } }],
      output: '<ul><li>Item</li></ul>',
    },

    // Redundant role="listitem" on <li>
    {
      code: '<li role="listitem">Item</li>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'listitem', element: 'li' } }],
      output: '<li>Item</li>',
    },

    // Redundant role="article" on <article>
    {
      code: '<article role="article">Content</article>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'article', element: 'article' } }],
      output: '<article>Content</article>',
    },

    // Redundant role="table" on <table>
    {
      code: '<table role="table"><tbody></tbody></table>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'table', element: 'table' } }],
      output: '<table><tbody></tbody></table>',
    },

    // TSX files
    {
      code: '<button role="button">TSX</button>',
      filename: 'component.tsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'button', element: 'button' } }],
      output: '<button>TSX</button>',
    },

    // Expression container value
    {
      code: '<nav role={"navigation"}>Nav</nav>',
      filename: 'test.jsx',
      errors: [{ messageId: 'redundantRole', data: { role: 'navigation', element: 'nav' } }],
      output: '<nav>Nav</nav>',
    },
  ],
});

console.log('no-redundant-roles: All tests passed!');
