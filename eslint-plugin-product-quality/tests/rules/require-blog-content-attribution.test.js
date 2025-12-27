/**
 * Tests for require-blog-content-attribution rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-blog-content-attribution');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-blog-content-attribution', rule, {
  valid: [
    // Non-blog file
    {
      code: '<div>Some content</div>',
      filename: 'about.tsx',
    },

    // Blog with author and date
    {
      code: `
        <article>
          <h1>Blog Post Title</h1>
          <p>By John Smith</p>
          <p>Published Jan 15, 2024</p>
        </article>
      `,
      filename: 'blog/post.tsx',
    },

    // Blog with author property and timestamp
    {
      code: `
        const post = {
          title: "Article Title",
          author: "Jane Doe",
          publishedAt: "2024-01-15",
        };
      `,
      filename: 'blog/[slug].tsx',
    },

    // Blog with team author
    {
      code: `
        <BlogPost>
          <p>Written by the Product Team</p>
          <time>March 2024</time>
        </BlogPost>
      `,
      filename: 'blog/update.tsx',
    },

    // Article with proper attribution
    {
      code: `
        <article>
          <header>
            <span>Posted by Mike</span>
            <span>Feb 20, 2024</span>
          </header>
        </article>
      `,
      filename: 'articles/guide.tsx',
    },
  ],

  invalid: [
    // Blog post missing both author and date
    {
      code: `
        <BlogPost>
          <h1>My Post Title</h1>
          <p>Some content here</p>
        </BlogPost>
      `,
      filename: '/app/blog/post.tsx',
      errors: [{ messageId: 'missingBothAttribution' }],
    },
  ],
});

console.log('✅ require-blog-content-attribution: All tests passed');
