/**
 * Tests for no-alert-calls rule
 */

const { RuleTester } = require('eslint');
const rule = require('../rules/no-alert-calls');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-alert-calls', rule, {
  valid: [
    // Using toast instead of alert
    {
      code: `
        import { toast } from "react-hot-toast";
        function handleSuccess() {
          toast.success("Operation completed!");
        }
      `,
    },
    // Using custom dialog
    {
      code: `
        import { showDialog } from "@/components/ui/dialog";
        function handleDelete() {
          showDialog({ title: "Confirm Delete", onConfirm: () => {} });
        }
      `,
    },
    // console.log is fine (not alert)
    {
      code: `
        function debug() {
          console.log("Debug message");
        }
      `,
    },
    // Variable named alert (not a call)
    {
      code: `
        const alert = document.getElementById("alert");
        alert.style.display = "block";
      `,
    },
  ],

  invalid: [
    // Direct alert() call - auto-fix replaces with console.warn TODO
    {
      code: `
        function showMessage() {
          alert("Hello!");
        }
      `,
      output: `
        function showMessage() {
          console.warn("TODO: Replace alert() with toast - was: alert('Hello!')");
        }
      `,
      errors: [{ messageId: 'noAlert' }],
    },
    // Direct confirm() call
    {
      code: `
        function handleDelete() {
          if (confirm("Are you sure?")) {
            deleteItem();
          }
        }
      `,
      output: `
        function handleDelete() {
          if (console.warn("TODO: Replace confirm() with toast - was: confirm('Are you sure?')")) {
            deleteItem();
          }
        }
      `,
      errors: [{ messageId: 'noConfirm' }],
    },
    // Direct prompt() call
    {
      code: `
        function getName() {
          const name = prompt("Enter your name:");
          return name;
        }
      `,
      output: `
        function getName() {
          const name = console.warn("TODO: Replace prompt() with toast - was: prompt('Enter your name:')");
          return name;
        }
      `,
      errors: [{ messageId: 'noPrompt' }],
    },
    // window.alert() call
    {
      code: `
        function showMessage() {
          window.alert("Hello!");
        }
      `,
      output: `
        function showMessage() {
          console.warn("TODO: Replace window.alert() with toast - was: window.alert('Hello!')");
        }
      `,
      errors: [{ messageId: 'noWindowAlert' }],
    },
    // window.confirm() call
    {
      code: `
        function handleDelete() {
          if (window.confirm("Are you sure?")) {
            deleteItem();
          }
        }
      `,
      output: `
        function handleDelete() {
          if (console.warn("TODO: Replace window.confirm() with toast - was: window.confirm('Are you sure?')")) {
            deleteItem();
          }
        }
      `,
      errors: [{ messageId: 'noWindowConfirm' }],
    },
    // Multiple violations
    {
      code: `
        function handler() {
          alert("First");
          confirm("Second");
        }
      `,
      output: `
        function handler() {
          console.warn("TODO: Replace alert() with toast - was: alert('First')");
          console.warn("TODO: Replace confirm() with toast - was: confirm('Second')");
        }
      `,
      errors: [
        { messageId: 'noAlert' },
        { messageId: 'noConfirm' },
      ],
    },
  ],
});

console.log('All no-alert-calls tests passed!');
