/**
 * Tests for require-input-sanitization rule
 * Security rule to prevent XSS and SQL injection
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-input-sanitization');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-input-sanitization', rule, {
  valid: [
    // Non-dangerous code
    { code: 'const x = 1;' },

    // dangerouslySetInnerHTML with DOMPurify.sanitize()
    { code: '<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />' },

    // dangerouslySetInnerHTML with sanitize function
    { code: '<div dangerouslySetInnerHTML={{__html: sanitize(userInput)}} />' },

    // dangerouslySetInnerHTML with escapeHtml
    { code: '<div dangerouslySetInnerHTML={{__html: escapeHtml(content)}} />' },

    // Safe SQL with parameterized queries (?)
    { code: 'const query = `SELECT * FROM users WHERE id = ?`' },

    // Safe SQL with named parameters (:)
    { code: 'const query = `SELECT * FROM users WHERE name = :name`' },

    // Safe SQL with PostgreSQL parameters ($)
    { code: 'const query = `SELECT * FROM users WHERE id = $1`' },

    // Non-SQL template literal with interpolation
    { code: 'const msg = `Hello ${name}!`' },

    // Import statement (no dangerous patterns)
    { code: 'import DOMPurify from "dompurify";' },
  ],

  invalid: [
    // Unsanitized dangerouslySetInnerHTML with direct variable
    {
      code: '<div dangerouslySetInnerHTML={{__html: userInput}} />',
      errors: [{ messageId: 'unsanitizedInnerHtml' }],
    },

    // Unsanitized dangerouslySetInnerHTML with property access
    {
      code: '<div dangerouslySetInnerHTML={{__html: data.content}} />',
      errors: [{ messageId: 'unsanitizedInnerHtml' }],
    },

    // SQL injection with string interpolation
    {
      code: 'const query = `SELECT * FROM users WHERE name = \'${userInput}\'`',
      errors: [{ messageId: 'sqlInjectionRisk' }],
    },

    // SQL injection with UPDATE
    {
      code: 'const query = `UPDATE users SET name = \'${name}\' WHERE id = ${id}`',
      errors: [{ messageId: 'sqlInjectionRisk' }],
    },

    // SQL injection with DELETE
    {
      code: 'const query = `DELETE FROM users WHERE id = ${userId}`',
      errors: [{ messageId: 'sqlInjectionRisk' }],
    },

    // SQL injection with INSERT
    {
      code: 'const query = `INSERT INTO users (name) VALUES (\'${userName}\')`',
      errors: [{ messageId: 'sqlInjectionRisk' }],
    },
  ],
});

console.log('require-input-sanitization: All tests passed!');
