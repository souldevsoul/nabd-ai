/**
 * Tests for no-blog-pages rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-blog-pages');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-blog-pages', rule, {
  valid: [
    { code: '<div>Welcome</div>', filename: '/app/page.tsx' },
    { code: '<div>About us</div>', filename: '/app/about/page.tsx' },
  ],
  invalid: [
    { code: '<div>Blog post</div>', filename: '/app/blog/page.tsx', errors: [{ messageId: 'noBlogPage' }] },
    { code: '<article>Post</article>', filename: '/app/blog/[slug]/page.tsx', errors: [{ messageId: 'noBlogPage' }] },
  ],
});
