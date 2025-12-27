/**
 * Tests for require-modern-saas-patterns rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-modern-saas-patterns');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-modern-saas-patterns', rule, {
  valid: [
    { code: 'import { toast } from "sonner"; <div>Content</div>', filename: '/app/page.tsx' },
    { code: 'import { Skeleton } from "./Skeleton"; <Spinner />', filename: '/app/page.tsx' }, // Has skeleton alternative
    { code: '<EmptyState><Button>Add item</Button></EmptyState>', filename: '/app/page.tsx' }, // Has CTA
    { code: '<RiAlertLine />', filename: '/app/page.tsx' }, // Icon - should be skipped
  ],
  invalid: [
    {
      code: '<Spinner />',
      filename: '/app/page.tsx',
      errors: [{ messageId: 'useSkeletonNotSpinner' }],
    },
  ],
});
