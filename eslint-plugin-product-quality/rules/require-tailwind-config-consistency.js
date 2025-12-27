/**
 * @fileoverview Ensures Tailwind CSS configuration is consistent with the version being used
 * @author AutoQA
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure Tailwind CSS configuration matches the version being used (v3 vs v4)',
      category: 'Configuration',
      recommended: true,
    },
    messages: {
      tailwindV4WithJsConfig:
        'Tailwind CSS v4 detected (@import "tailwindcss" in globals.css) but configuration found in tailwind.config.js. ' +
        'Tailwind v4 ignores JS config files. Move your custom colors and configuration to @theme directive in globals.css. ' +
        'See: https://tailwindcss.com/docs/v4-beta',
      tailwindV4MissingTheme:
        'Tailwind CSS v4 detected but no @theme directive found in {{file}}. ' +
        'Custom colors from tailwind.config.js will not be applied. ' +
        'Add @theme { --color-*: #hex; } after @import "tailwindcss";',
      tailwindV3WithThemeDirective:
        'Tailwind CSS v3 detected but @theme directive found in {{file}}. ' +
        '@theme is a v4 feature and will be ignored. Use tailwind.config.js instead.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    let hasReported = false;

    return {
      Program(node) {
        if (hasReported) return;

        const filename = context.getFilename();
        const cwd = context.getCwd();

        // Only check from root files (not node_modules, .next, etc.)
        if (filename.includes('node_modules') || filename.includes('.next') || filename.includes('dist')) {
          return;
        }

        // Check postcss.config.mjs for Tailwind v4
        const postcssConfigPath = path.join(cwd, 'postcss.config.mjs');
        const postcssConfigPathJs = path.join(cwd, 'postcss.config.js');

        let isTailwindV4 = false;
        let postcssContent = '';

        if (fs.existsSync(postcssConfigPath)) {
          postcssContent = fs.readFileSync(postcssConfigPath, 'utf8');
          isTailwindV4 = postcssContent.includes('@tailwindcss/postcss');
        } else if (fs.existsSync(postcssConfigPathJs)) {
          postcssContent = fs.readFileSync(postcssConfigPathJs, 'utf8');
          isTailwindV4 = postcssContent.includes('@tailwindcss/postcss');
        }

        // Check globals.css for @import "tailwindcss" (v4) or @tailwind directives (v3)
        const possibleGlobalsCssPaths = [
          path.join(cwd, 'app/globals.css'),
          path.join(cwd, 'src/app/globals.css'),
          path.join(cwd, 'styles/globals.css'),
          path.join(cwd, 'src/styles/globals.css'),
        ];

        let globalsCssPath = null;
        let globalsCssContent = '';

        for (const cssPath of possibleGlobalsCssPaths) {
          if (fs.existsSync(cssPath)) {
            globalsCssPath = cssPath;
            globalsCssContent = fs.readFileSync(cssPath, 'utf8');
            break;
          }
        }

        if (!globalsCssPath) return;

        const hasImportTailwindcss = globalsCssContent.includes('@import "tailwindcss"') ||
                                      globalsCssContent.includes("@import 'tailwindcss'");
        const hasTailwindDirectives = globalsCssContent.includes('@tailwind');
        const hasThemeDirective = globalsCssContent.includes('@theme');

        // Check tailwind.config.js/ts
        const tailwindConfigPaths = [
          path.join(cwd, 'tailwind.config.js'),
          path.join(cwd, 'tailwind.config.ts'),
        ];

        let tailwindConfigPath = null;
        let tailwindConfigContent = '';
        let hasCustomColors = false;

        for (const configPath of tailwindConfigPaths) {
          if (fs.existsSync(configPath)) {
            tailwindConfigPath = configPath;
            tailwindConfigContent = fs.readFileSync(configPath, 'utf8');

            // Check if config has custom colors (extend.colors or theme.colors)
            hasCustomColors =
              (tailwindConfigContent.includes('extend') && tailwindConfigContent.includes('colors')) ||
              (tailwindConfigContent.includes('theme:') && tailwindConfigContent.includes('colors'));

            break;
          }
        }

        // Detect Tailwind version
        const detectedV4 = isTailwindV4 || hasImportTailwindcss;
        const detectedV3 = hasTailwindDirectives && !hasImportTailwindcss;

        // Rule 1: Tailwind v4 with JS config but no @theme directive
        if (detectedV4 && tailwindConfigPath && hasCustomColors && !hasThemeDirective) {
          context.report({
            node,
            messageId: 'tailwindV4WithJsConfig',
          });
          hasReported = true;
          return;
        }

        // Rule 2: Tailwind v4 with custom colors in JS but missing @theme
        if (detectedV4 && hasCustomColors && !hasThemeDirective) {
          context.report({
            node,
            messageId: 'tailwindV4MissingTheme',
            data: {
              file: path.relative(cwd, globalsCssPath),
            },
          });
          hasReported = true;
          return;
        }

        // Rule 3: Tailwind v3 with @theme directive (will be ignored)
        if (detectedV3 && hasThemeDirective) {
          context.report({
            node,
            messageId: 'tailwindV3WithThemeDirective',
            data: {
              file: path.relative(cwd, globalsCssPath),
            },
          });
          hasReported = true;
          return;
        }
      },
    };
  },
};
