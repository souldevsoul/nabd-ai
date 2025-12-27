/**
 * Tests for no-object-injection rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-object-injection');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-object-injection', rule, {
  valid: [
    // Direct property access is fine
    { code: 'const x = obj.property;' },
    { code: 'const x = obj.nested.property;' },

    // Literal property access is fine
    { code: 'const x = obj["property"];' },
    { code: 'const x = obj["nested"]["property"];' },

    // Loop variables are safe
    { code: 'for (let i = 0; i < arr.length; i++) { arr[i]; }' },
    { code: 'const x = arr[index];' },
    { code: 'const x = arr[idx];' },
    { code: 'const x = obj[key];' },
    { code: 'const x = obj[id];' },

    // Test files are skipped
    {
      code: 'const x = obj[req.body.key];',
      filename: '/tests/example.test.js',
    },

    // Object.assign with literals is fine
    { code: 'Object.assign(target, { foo: "bar" });' },
    { code: 'Object.assign({}, source);' },

    // Number access is fine
    { code: 'const x = arr[0];' },
    { code: 'const x = arr[arr.length - 1];' },
  ],

  invalid: [
    // Access with req.body
    {
      code: 'const x = obj[req.body.key];',
      errors: [{ messageId: 'objectInjection' }],
    },

    // Access with req.query
    {
      code: 'const x = obj[req.query.field];',
      errors: [{ messageId: 'objectInjection' }],
    },

    // Access with params
    {
      code: 'const x = data[params.id];',
      errors: [{ messageId: 'objectInjection' }],
    },

    // Access with userInput variable
    {
      code: 'const x = config[userInput];',
      errors: [{ messageId: 'objectInjection' }],
    },

    // Direct __proto__ access
    {
      code: 'const x = obj["__proto__"];',
      errors: [{ messageId: 'prototypeAccess' }],
    },

    // Direct prototype access
    {
      code: 'const x = obj["prototype"];',
      errors: [{ messageId: 'prototypeAccess' }],
    },

    // Direct constructor access
    {
      code: 'const x = obj["constructor"];',
      errors: [{ messageId: 'prototypeAccess' }],
    },

    // Object.assign with user input
    {
      code: 'Object.assign(target, req.body);',
      errors: [{ messageId: 'dynamicAssign' }],
    },

    // Object.assign with request data
    {
      code: 'Object.assign(config, request.query);',
      errors: [{ messageId: 'dynamicAssign' }],
    },
  ],
});

console.log('no-object-injection: All tests passed!');
