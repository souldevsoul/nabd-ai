/**
 * Tests for no-button-without-handler rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-button-without-handler');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-button-without-handler', rule, {
  valid: [
    { code: '<button onClick={handleClick}>Click</button>' },
    { code: '<button type="submit">Submit</button>' },
    { code: '<Button onClick={() => {}}>Action</Button>' },
  ],
  invalid: [
    {
      code: '<button>Click me</button>',
      output: '<button type="button">Click me</button>',
      errors: [{ messageId: 'missingHandler' }],
    },
    {
      code: '<button className="btn">Click</button>',
      output: '<button className="btn" type="button">Click</button>',
      errors: [{ messageId: 'missingHandler' }],
    },
  ],
});
