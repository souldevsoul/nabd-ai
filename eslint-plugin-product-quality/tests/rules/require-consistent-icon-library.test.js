/**
 * Tests for require-consistent-icon-library rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/require-consistent-icon-library');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('require-consistent-icon-library', rule, {
  valid: [
    { code: 'import { Home } from "lucide-react";' }, // Default approved library
    { code: 'import { Home } from "lucide-react";', options: [{ library: 'lucide-react' }] },
    { code: 'import { ArrowIcon } from "@heroicons/react";', options: [{ library: '@heroicons/react', allowedImports: ['@heroicons/react'] }] },
    { code: 'import { Button } from "./components";' }, // Not an icon library
  ],
  invalid: [
    {
      code: 'import { FaHome } from "react-icons/fa";',
      errors: [{ messageId: 'prohibitedLibrary' }],
    },
    {
      code: 'import { RiHomeLine } from "react-icons/ri";',
      errors: [{ messageId: 'prohibitedLibrary' }],
    },
  ],
});
