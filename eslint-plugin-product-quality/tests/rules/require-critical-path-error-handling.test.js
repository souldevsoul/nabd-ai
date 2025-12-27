/**
 * Tests for require-critical-path-error-handling rule
 * Ensures critical user flows have proper error handling
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/require-critical-path-error-handling');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('require-critical-path-error-handling', rule, {
  valid: [
    // Non-critical function
    { code: 'function regularFunction() { doSomething(); }' },

    // Critical function with try-catch
    {
      code: `
        async function handleCheckout() {
          try {
            const order = await createOrder();
            await processPayment(order);
          } catch (error) {
            console.error('Checkout failed:', error);
            showError('Payment failed');
          }
        }
      `,
    },

    // Payment function with proper error handling
    {
      code: `
        async function processPayment(amount) {
          try {
            const result = await stripe.charges.create({ amount });
            return result;
          } catch (error) {
            logger.error(error);
            throw new PaymentError('Payment failed');
          }
        }
      `,
    },

    // Login with error handling
    {
      code: `
        const handleLogin = async (credentials) => {
          try {
            const user = await auth.signIn(credentials);
            return user;
          } catch (error) {
            toast.error('Login failed');
          }
        };
      `,
    },

    // Non-async critical function (sync operations)
    {
      code: `
        function validateCheckout(cart) {
          if (!cart.items.length) {
            throw new Error('Empty cart');
          }
          return true;
        }
      `,
    },

    // Arrow function with expression body (not block)
    {
      code: 'const handlePayment = async (data) => processData(data);',
    },
  ],

  invalid: [
    // Checkout without try-catch
    {
      code: `
        async function handleCheckout() {
          const order = await createOrder();
          await processPayment(order);
          router.push('/success');
        }
      `,
      errors: [{ messageId: 'missingTryCatch', data: { funcName: 'handleCheckout' } }],
    },

    // Payment function without error handling
    {
      code: `
        async function processPayment(amount) {
          const result = await stripe.charges.create({ amount });
          return result;
        }
      `,
      errors: [{ messageId: 'missingTryCatch', data: { funcName: 'processPayment' } }],
    },

    // Login without try-catch
    {
      code: `
        const handleLogin = async (credentials) => {
          const user = await auth.signIn(credentials);
          return user;
        };
      `,
      errors: [{ messageId: 'missingTryCatch', data: { funcName: 'handleLogin' } }],
    },

    // Signup without error handling
    {
      code: `
        async function handleSignup(userData) {
          await createUser(userData);
          await sendWelcomeEmail(userData.email);
        }
      `,
      errors: [{ messageId: 'missingTryCatch', data: { funcName: 'handleSignup' } }],
    },

    // Subscribe without error handling
    {
      code: `
        async function subscribeUser(plan) {
          await createSubscription(plan);
        }
      `,
      errors: [{ messageId: 'missingTryCatch', data: { funcName: 'subscribeUser' } }],
    },

    // Empty catch block in critical function
    {
      code: `
        async function handleCheckout() {
          try {
            await processPayment();
          } catch (e) {
          }
        }
      `,
      errors: [{ messageId: 'missingCatchHandler', data: { funcName: 'handleCheckout' } }],
    },
  ],
});

console.log('require-critical-path-error-handling: All tests passed!');
