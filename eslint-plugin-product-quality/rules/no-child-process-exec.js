/**
 * ESLint Rule: no-child-process-exec
 *
 * Detects usage of child_process.exec() and similar functions that
 * allow shell command injection when used with user input.
 *
 * Dangerous patterns:
 * - exec(userInput)
 * - execSync(userInput)
 * - spawn with shell: true
 *
 * Safe alternatives:
 * - Use execFile() or spawnSync() with arguments array
 * - Validate and sanitize all input
 *
 * OWASP: Injection (A03:2021)
 * CWE-78: OS Command Injection
 *
 * @version 1.0.0
 * @category Security
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow dangerous child_process methods with user input',
      category: 'Security',
      recommended: true,
    },
    messages: {
      noExec: 'child_process.exec() is dangerous. Use execFile() with an arguments array instead.',
      noExecSync: 'child_process.execSync() is dangerous. Use execFileSync() with an arguments array instead.',
      noShellOption: 'spawn() with shell: true is dangerous. Use spawn() without shell option and pass arguments as array.',
      dynamicCommand: 'Command contains dynamic input. Validate and sanitize all user input before passing to child_process.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')) {
      return {};
    }

    // Track child_process imports
    let childProcessImported = false;
    let childProcessAlias = null;
    let execImported = false;
    let execSyncImported = false;
    let spawnImported = false;

    // Patterns that indicate user input
    const userInputPatterns = [
      /req\./,
      /request\./,
      /query\./,
      /params\./,
      /body\./,
      /input/i,
      /userInput/i,
      /args/i,
      /argv/i,
    ];

    function containsUserInput(node) {
      const sourceCode = context.getSourceCode();
      const text = sourceCode.getText(node);

      for (const pattern of userInputPatterns) {
        if (pattern.test(text)) {
          return true;
        }
      }

      return false;
    }

    function hasShellOption(node) {
      const args = node.arguments;
      if (args.length < 2) return false;

      // Check if there's an options object with shell: true
      const optionsArg = args[args.length - 1];
      if (optionsArg.type === 'ObjectExpression') {
        for (const prop of optionsArg.properties) {
          if (
            prop.key &&
            prop.key.type === 'Identifier' &&
            prop.key.name === 'shell' &&
            prop.value &&
            prop.value.type === 'Literal' &&
            prop.value.value === true
          ) {
            return true;
          }
        }
      }

      return false;
    }

    return {
      // Track imports
      ImportDeclaration(node) {
        if (node.source.value === 'child_process') {
          childProcessImported = true;

          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportDefaultSpecifier') {
              childProcessAlias = specifier.local.name;
            } else if (specifier.type === 'ImportNamespaceSpecifier') {
              childProcessAlias = specifier.local.name;
            } else if (specifier.type === 'ImportSpecifier') {
              const importedName = specifier.imported.name;
              if (importedName === 'exec') execImported = specifier.local.name;
              if (importedName === 'execSync') execSyncImported = specifier.local.name;
              if (importedName === 'spawn') spawnImported = specifier.local.name;
            }
          }
        }
      },

      // Track require() calls
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'Identifier' &&
          node.init.callee.name === 'require' &&
          node.init.arguments[0] &&
          node.init.arguments[0].value === 'child_process'
        ) {
          childProcessImported = true;

          if (node.id.type === 'Identifier') {
            childProcessAlias = node.id.name;
          } else if (node.id.type === 'ObjectPattern') {
            // Destructuring: const { exec, spawn } = require('child_process')
            for (const prop of node.id.properties) {
              if (prop.key.name === 'exec') execImported = prop.value.name;
              if (prop.key.name === 'execSync') execSyncImported = prop.value.name;
              if (prop.key.name === 'spawn') spawnImported = prop.value.name;
            }
          }
        }
      },

      CallExpression(node) {
        // Check for childProcess.exec() or childProcess.execSync()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier'
        ) {
          const objectName = node.callee.object.name;
          const methodName = node.callee.property.name;

          // Check if calling on childProcess module
          if (objectName === childProcessAlias || objectName === 'child_process') {
            if (methodName === 'exec') {
              context.report({
                node,
                messageId: 'noExec',
              });
              return;
            }

            if (methodName === 'execSync') {
              context.report({
                node,
                messageId: 'noExecSync',
              });
              return;
            }

            if (methodName === 'spawn' && hasShellOption(node)) {
              context.report({
                node,
                messageId: 'noShellOption',
              });
              return;
            }
          }
        }

        // Check for direct exec() calls
        if (node.callee.type === 'Identifier') {
          const funcName = node.callee.name;

          if (funcName === execImported || funcName === 'exec') {
            const firstArg = node.arguments[0];
            if (firstArg && containsUserInput(firstArg)) {
              context.report({
                node,
                messageId: 'dynamicCommand',
              });
            } else {
              context.report({
                node,
                messageId: 'noExec',
              });
            }
            return;
          }

          if (funcName === execSyncImported || funcName === 'execSync') {
            context.report({
              node,
              messageId: 'noExecSync',
            });
            return;
          }

          if ((funcName === spawnImported || funcName === 'spawn') && hasShellOption(node)) {
            context.report({
              node,
              messageId: 'noShellOption',
            });
          }
        }
      },
    };
  },
};
