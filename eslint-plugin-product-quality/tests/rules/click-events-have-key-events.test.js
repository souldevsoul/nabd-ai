/**
 * Tests for click-events-have-key-events rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/click-events-have-key-events');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('click-events-have-key-events', rule, {
  valid: [
    // Button with onClick (native keyboard support)
    { code: '<button onClick={handleClick}>Click</button>' },
    // Link with onClick
    { code: '<a href="/page" onClick={handleClick}>Link</a>' },
    // Input with onClick
    { code: '<input onClick={handleClick} />' },
    // Div with onClick and onKeyDown
    { code: '<div onClick={handleClick} onKeyDown={handleKey}>Clickable</div>' },
    // Div with onClick and onKeyUp
    { code: '<div onClick={handleClick} onKeyUp={handleKey}>Clickable</div>' },
    // Div without onClick (no issue)
    { code: '<div>Not clickable</div>' },
    // Next.js Link
    { code: '<Link href="/page" onClick={track}>Go</Link>' },
  ],

  invalid: [
    // Div with onClick but no keyboard handler
    {
      code: '<div onClick={handleClick}>Clickable div</div>',
      errors: [{ messageId: 'missingKeyEvent' }],
    },
    // Span with onClick but no keyboard handler
    {
      code: '<span onClick={handleClick}>Clickable span</span>',
      errors: [{ messageId: 'missingKeyEvent' }],
    },
    // Section with onClick
    {
      code: '<section onClick={handleClick}>Content</section>',
      errors: [{ messageId: 'missingKeyEvent' }],
    },
  ],
});

console.log('click-events-have-key-events: All tests passed!');
