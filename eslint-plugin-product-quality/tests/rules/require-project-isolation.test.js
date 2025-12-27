/**
 * Tests for require-project-isolation rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-project-isolation');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-project-isolation', rule, {
  valid: [
    // Valid: No template references
    {
      code: 'const appName = "MyRealApp";',
    },
    // Valid: Short strings should be skipped
    {
      code: 'const x = "ab";',
    },
    // Valid: API paths should be skipped
    {
      code: 'const url = "/api/template-handler";',
    },
    // Valid: HTTP URLs should be skipped
    {
      code: 'const url = "https://example.com/template";',
    },
    // Valid: Normal import
    {
      code: 'import { Button } from "@/components/ui/button";',
    },
    // Valid: JSX with real image
    {
      code: '<img src="/images/hero.png" alt="Hero" />',
    },
    // Valid: Custom patterns with no match
    {
      code: 'const name = "PetPortrait AI";',
      options: [{ templatePatterns: ['voicecraft', 'oldproject'] }],
    },
  ],

  invalid: [
    // Invalid: Reference to template
    {
      code: 'const name = "My Template App";',
      errors: [{ messageId: 'oldProjectReference' }],
    },
    // Invalid: Reference to boilerplate
    {
      code: 'const title = "React Boilerplate";',
      errors: [{ messageId: 'oldProjectReference' }],
    },
    // Invalid: Reference to starter
    {
      code: 'const desc = "NextJS Starter Project";',
      errors: [{ messageId: 'oldProjectReference' }],
    },
    // Invalid: Reference to example-app
    {
      code: 'const app = "example-app";',
      errors: [{ messageId: 'oldProjectReference' }],
    },
    // Invalid: Template literal with template reference
    {
      code: 'const msg = `Welcome to ${name} starter`;',
      errors: [{ messageId: 'oldProjectReference' }],
    },
    // Invalid: Import from template path
    {
      code: 'import { util } from "./template/utils";',
      errors: [{ messageId: 'oldProjectImport' }],
    },
    // Invalid: Import from boilerplate
    {
      code: 'import config from "boilerplate-config";',
      errors: [{ messageId: 'oldProjectImport' }],
    },
    // Invalid: JSX src with template reference
    {
      code: '<img src="/images/acme-logo.png" alt="Logo" />',
      errors: [{ messageId: 'oldProjectReference' }],
    },
    // Invalid: Custom pattern match
    {
      code: 'const name = "VoiceCraft Pro";',
      options: [{ templatePatterns: ['voicecraft'] }],
      errors: [{ messageId: 'oldProjectReference' }],
    },
    // Invalid: my-app reference
    {
      code: 'const project = "my-app";',
      errors: [{ messageId: 'oldProjectReference' }],
    },
  ],
});

console.log('✅ require-project-isolation: All tests passed');
