/**
 * ESLint Rule: require-environment-variables
 *
 * Validates that required environment variables are defined before build.
 * Prevents runtime errors from missing API keys, secrets, and configuration.
 *
 * @version 2.2
 * @date 2025-11-18
 * @strictness error (build fails if violated)
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures all required environment variables are defined in .env files',
      category: 'Configuration',
      recommended: true,
    },
    messages: {
      missingEnvVar: 'Environment variable "{{varName}}" is used but not defined in .env files',
      missingEnvFile: 'No .env or .env.local file found in project root',
      undefinedEnvVar: 'Environment variable "{{varName}}" is undefined (found in {{file}}:{{line}})',
    },
    schema: [
      {
        type: 'object',
        properties: {
          requiredVars: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of environment variables that MUST be defined',
            default: [],
          },
          checkAllUsed: {
            type: 'boolean',
            description: 'Check that ALL used process.env variables are defined',
            default: true,
          },
          envFiles: {
            type: 'array',
            items: { type: 'string' },
            description: 'Environment files to check',
            default: ['.env', '.env.local', '.env.production', '.env.development'],
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const requiredVars = options.requiredVars || [];
    const checkAllUsed = options.checkAllUsed !== false;
    const envFiles = options.envFiles || ['.env', '.env.local', '.env.production', '.env.development'];

    const basePath = context.getCwd();
    const filename = context.getFilename();

    // Only check in code files, not config files
    if (filename.includes('eslint.config') || filename.includes('next.config')) {
      return {};
    }

    // Load environment variables from all .env files
    const loadEnvVars = () => {
      const envVars = new Set();

      for (const envFile of envFiles) {
        const envPath = path.join(basePath, envFile);
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8');

          // Parse .env file (simple parser)
          const lines = content.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();

            // Skip comments and empty lines
            if (!trimmed || trimmed.startsWith('#')) continue;

            // Extract variable name (before =)
            const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=/);
            if (match) {
              envVars.add(match[1]);
            }
          }
        }
      }

      return envVars;
    };

    const envVars = loadEnvVars();

    // Track used variables in this file
    const usedVars = new Set();

    return {
      // Detect: process.env.VAR_NAME
      MemberExpression(node) {
        if (
          node.object.type === 'MemberExpression' &&
          node.object.object.name === 'process' &&
          node.object.property.name === 'env' &&
          node.property.type === 'Identifier'
        ) {
          const varName = node.property.name;
          usedVars.add(varName);

          // Check if this variable is defined
          if (checkAllUsed && !envVars.has(varName)) {
            // Ignore certain common variables that might come from system/runtime or are optional
            const ignoredVars = [
              'NODE_ENV', 'VERCEL', 'VERCEL_ENV', 'CI', 'NEXT_PUBLIC_VERCEL_URL',
              // OAuth providers (optional - not all projects use them)
              'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
              'GITHUB_ID', 'GITHUB_SECRET',
            ];
            if (!ignoredVars.includes(varName)) {
              context.report({
                node,
                messageId: 'undefinedEnvVar',
                data: {
                  varName,
                  file: path.relative(basePath, filename),
                  line: node.loc.start.line,
                },
              });
            }
          }
        }
      },

      // At end of file, check required variables
      'Program:exit'(node) {
        for (const requiredVar of requiredVars) {
          if (!envVars.has(requiredVar)) {
            context.report({
              node,
              messageId: 'missingEnvVar',
              data: { varName: requiredVar },
            });
          }
        }
      },
    };
  },
};
