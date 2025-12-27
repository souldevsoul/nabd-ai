/**
 * Tests for mouse-events-have-key-events rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/mouse-events-have-key-events');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('mouse-events-have-key-events', rule, {
  valid: [
    // onMouseOver with onFocus
    { code: '<div onMouseOver={show} onFocus={show}>Tooltip trigger</div>' },
    // onMouseOut with onBlur
    { code: '<div onMouseOut={hide} onBlur={hide}>Tooltip trigger</div>' },
    // Both mouse and keyboard handlers
    { code: '<div onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>Complete</div>' },
    // No mouse events (no issue)
    { code: '<div onClick={handleClick}>Click only</div>' },
    // Only focus handlers
    { code: '<div onFocus={show} onBlur={hide}>Focus handlers</div>' },
  ],

  invalid: [
    // onMouseOver without onFocus
    {
      code: '<div onMouseOver={showTooltip}>Hover me</div>',
      errors: [{ messageId: 'mouseOverWithoutFocus' }],
    },
    // onMouseOut without onBlur
    {
      code: '<div onMouseOut={hideTooltip}>Hover me</div>',
      errors: [{ messageId: 'mouseOutWithoutBlur' }],
    },
    // onMouseEnter without onFocus
    {
      code: '<div onMouseEnter={handleEnter}>Enter zone</div>',
      errors: [{ messageId: 'mouseOverWithoutFocus' }],
    },
    // onMouseLeave without onBlur
    {
      code: '<div onMouseLeave={handleLeave}>Leave zone</div>',
      errors: [{ messageId: 'mouseOutWithoutBlur' }],
    },
    // Both mouse events, neither keyboard event
    {
      code: '<div onMouseOver={show} onMouseOut={hide}>Both missing</div>',
      errors: [
        { messageId: 'mouseOverWithoutFocus' },
        { messageId: 'mouseOutWithoutBlur' },
      ],
    },
  ],
});

console.log('mouse-events-have-key-events: All tests passed!');
