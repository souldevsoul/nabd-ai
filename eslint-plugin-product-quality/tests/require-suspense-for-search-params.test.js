/**
 * Tests for require-suspense-for-search-params rule
 */

const { RuleTester } = require('eslint');
const rule = require('../rules/require-suspense-for-search-params');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('require-suspense-for-search-params', rule, {
  valid: [
    // Page with useSearchParams and Suspense import
    {
      code: `
        import { Suspense } from "react";
        import { useSearchParams } from "next/navigation";

        function SearchForm() {
          const searchParams = useSearchParams();
          return <div>{searchParams.get("q")}</div>;
        }

        export default function Page() {
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <SearchForm />
            </Suspense>
          );
        }
      `,
      filename: '/app/search/page.tsx',
    },
    // Page with Suspense wrapper
    {
      code: `
        import { Suspense } from "react";
        import { SearchContent } from "./search-content";

        export default function Page() {
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <SearchContent />
            </Suspense>
          );
        }
      `,
      filename: '/app/auth/signin/page.tsx',
    },
    // Non-page file (should be skipped)
    {
      code: `
        import { useSearchParams } from "next/navigation";

        export function SearchForm() {
          const searchParams = useSearchParams();
          return <div>{searchParams.get("q")}</div>;
        }
      `,
      filename: '/components/search-form.tsx',
    },
    // Page without useSearchParams (no issue)
    {
      code: `
        export default function Page() {
          return <div>Hello World</div>;
        }
      `,
      filename: '/app/about/page.tsx',
    },
  ],

  invalid: [
    // Page with useSearchParams but no Suspense
    {
      code: `
        import { useSearchParams } from "next/navigation";

        export default function Page() {
          const searchParams = useSearchParams();
          return <div>{searchParams.get("redirect")}</div>;
        }
      `,
      filename: '/app/auth/signin/page.tsx',
      errors: [{ messageId: 'missingSuspense' }],
    },
    // Auth error page without Suspense
    {
      code: `
        import { useSearchParams, useRouter } from "next/navigation";

        export default function ErrorPage() {
          const searchParams = useSearchParams();
          const error = searchParams.get("error");
          return <div>Error: {error}</div>;
        }
      `,
      filename: '/app/auth/error/page.tsx',
      errors: [{ messageId: 'missingSuspense' }],
    },
  ],
});

console.log('All require-suspense-for-search-params tests passed!');
