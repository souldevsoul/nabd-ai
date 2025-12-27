/**
 * Tests for no-eval rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-eval');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-eval', rule, {
  valid: [
    // Normal function calls are fine
    { code: 'const result = myFunction(data);' },

    // setTimeout/setInterval with function reference is fine
    { code: 'setTimeout(myFunction, 1000);' },
    { code: 'setInterval(() => console.log("tick"), 1000);' },
    { code: 'window.setTimeout(callback, 100);' },

    // Arrow functions are fine
    { code: 'setTimeout(() => { doSomething(); }, 1000);' },

    // Test files are skipped
    {
      code: 'eval("test code");',
      filename: '/tests/example.test.js',
    },
    {
      code: 'eval("test code");',
      filename: '/src/__tests__/helper.js',
    },

    // Regular Function keyword usage (not constructor)
    { code: 'function myFunc() { return 1; }' },
    { code: 'const fn = function() { return 2; };' },
  ],

  invalid: [
    // Direct eval()
    {
      code: 'eval("alert(1)");',
      errors: [{ messageId: 'noEval' }],
    },
    {
      code: 'const result = eval(userInput);',
      errors: [{ messageId: 'noEval' }],
    },

    // window.eval, global.eval
    {
      code: 'window.eval("code");',
      errors: [{ messageId: 'noEval' }],
    },
    {
      code: 'global.eval(dynamicCode);',
      errors: [{ messageId: 'noEval' }],
    },
    {
      code: 'globalThis.eval(code);',
      errors: [{ messageId: 'noEval' }],
    },

    // new Function()
    {
      code: 'new Function("return 1");',
      errors: [{ messageId: 'noFunctionConstructor' }],
    },
    {
      code: 'const fn = new Function("a", "b", "return a + b");',
      errors: [{ messageId: 'noFunctionConstructor' }],
    },

    // setTimeout with string (implied eval)
    {
      code: 'setTimeout("alert(1)", 1000);',
      errors: [{ messageId: 'noImpliedEval', data: { name: 'setTimeout' } }],
    },
    {
      code: 'window.setTimeout("doSomething()", 500);',
      errors: [{ messageId: 'noImpliedEval', data: { name: 'setTimeout' } }],
    },

    // setInterval with string (implied eval)
    {
      code: 'setInterval("counter++", 1000);',
      errors: [{ messageId: 'noImpliedEval', data: { name: 'setInterval' } }],
    },

    // Template literal in setTimeout (also dangerous)
    {
      code: 'setTimeout(`${dynamicCode}`, 1000);',
      errors: [{ messageId: 'noImpliedEval', data: { name: 'setTimeout' } }],
    },
  ],
});

console.log('no-eval: All tests passed!');
