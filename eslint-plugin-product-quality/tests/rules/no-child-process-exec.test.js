/**
 * Tests for no-child-process-exec rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../rules/no-child-process-exec');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-child-process-exec', rule, {
  valid: [
    // execFile is safe
    {
      code: `
        const { execFile } = require('child_process');
        execFile('ls', ['-la']);
      `,
    },

    // spawn without shell option is safe
    {
      code: `
        const { spawn } = require('child_process');
        spawn('ls', ['-la']);
      `,
    },

    // spawn with shell: false is safe
    {
      code: `
        const { spawn } = require('child_process');
        spawn('ls', ['-la'], { shell: false });
      `,
    },

    // Test files are skipped
    {
      code: `
        const { exec } = require('child_process');
        exec('ls -la');
      `,
      filename: '/tests/example.test.js',
    },

    // Non-child_process exec is fine
    {
      code: 'myObject.exec("something");',
    },
  ],

  invalid: [
    // Direct exec import and usage
    {
      code: `
        const { exec } = require('child_process');
        exec('ls -la');
      `,
      errors: [{ messageId: 'noExec' }],
    },

    // execSync usage
    {
      code: `
        const { execSync } = require('child_process');
        execSync('rm -rf /');
      `,
      errors: [{ messageId: 'noExecSync' }],
    },

    // spawn with shell: true
    {
      code: `
        const { spawn } = require('child_process');
        spawn('ls', [], { shell: true });
      `,
      errors: [{ messageId: 'noShellOption' }],
    },

    // child_process.exec member expression
    {
      code: `
        const childProcess = require('child_process');
        childProcess.exec('ls -la');
      `,
      errors: [{ messageId: 'noExec' }],
    },

    // child_process.execSync member expression
    {
      code: `
        const childProcess = require('child_process');
        childProcess.execSync('npm install');
      `,
      errors: [{ messageId: 'noExecSync' }],
    },

    // child_process.spawn with shell: true
    {
      code: `
        const childProcess = require('child_process');
        childProcess.spawn('node', ['app.js'], { shell: true });
      `,
      errors: [{ messageId: 'noShellOption' }],
    },

    // ES module import
    {
      code: `
        import { exec } from 'child_process';
        exec('ls -la');
      `,
      errors: [{ messageId: 'noExec' }],
    },

    // Dynamic command with user input
    {
      code: `
        const { exec } = require('child_process');
        exec(req.body.command);
      `,
      errors: [{ messageId: 'dynamicCommand' }],
    },
  ],
});

console.log('no-child-process-exec: All tests passed!');
