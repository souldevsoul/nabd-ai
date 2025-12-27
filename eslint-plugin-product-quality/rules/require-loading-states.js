/**
 * @fileoverview Ensure async components and data fetching have proper loading states
 * @author AutoQA
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require loading states for async operations',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingLoadingState: 'Async component "{{name}}" should handle loading state',
      missingErrorState: 'Async component "{{name}}" should handle error state',
      missingFetchErrorHandling: 'fetch() call should have error handling with try-catch',
      missingAsyncErrorHandling: 'Async function "{{name}}" should have error handling',
    },
    schema: [],
  },

  create(context) {
    const asyncComponents = new Set();
    const handledComponents = new Set();
    const filename = context.getFilename();

    // Skip API routes - they don't render UI and don't need loading states
    if (filename.includes('/api/') || filename.includes('/route.')) {
      return {};
    }

    // Skip admin pages - server components with internal auth handling
    if (filename.includes('/admin/')) {
      return {};
    }

    // Skip OG/Twitter image generators - server-side rendering only
    if (filename.includes('opengraph-image') || filename.includes('twitter-image')) {
      return {};
    }

    return {
      // Check for async Server Components in Next.js
      FunctionDeclaration(node) {
        if (node.async && node.id) {
          const funcName = node.id.name;

          // Skip API route handlers (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
          const apiHandlers = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
          if (apiHandlers.includes(funcName)) {
            return;
          }

          // Check if it's a Page/Layout component (common Next.js patterns)
          if (funcName.endsWith('Page') || funcName.endsWith('Layout') || funcName.match(/^[A-Z]/)) {
            asyncComponents.add(funcName);

            // Check for Suspense wrapper or error handling
            const hasErrorHandling = checkErrorHandling(node.body);
            if (hasErrorHandling) {
              handledComponents.add(funcName);
            }
          }
        }
      },

      // Check for fetch calls without error handling
      CallExpression(node) {
        if (
          node.callee.name === 'fetch' ||
          (node.callee.object && node.callee.object.name === 'fetch')
        ) {
          // Check if fetch is inside try-catch
          let parent = node.parent;
          let inTryCatch = false;

          while (parent) {
            if (parent.type === 'TryStatement') {
              inTryCatch = true;
              break;
            }
            parent = parent.parent;
          }

          if (!inTryCatch) {
            context.report({
              node,
              messageId: 'missingFetchErrorHandling',
            });
          }
        }
      },

      // Check JSX for Suspense boundaries
      JSXElement(node) {
        if (
          node.openingElement.name.name === 'Suspense' ||
          node.openingElement.name.name === 'ErrorBoundary'
        ) {
          // Mark parent component as handled
          let parent = node.parent;
          while (parent) {
            if (parent.type === 'FunctionDeclaration' && parent.id) {
              handledComponents.add(parent.id.name);
              break;
            }
            parent = parent.parent;
          }
        }
      },

      // Final check at program exit
      'Program:exit'() {
        asyncComponents.forEach(componentName => {
          if (!handledComponents.has(componentName)) {
            // Find the node for better error reporting
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingLoadingState',
              data: { name: componentName },
            });
          }
        });
      },
    };

    function checkErrorHandling(node) {
      if (!node) return false;

      // Check for try-catch
      if (node.type === 'TryStatement') return true;

      // Check for .catch()
      if (node.type === 'CallExpression' && node.callee.property?.name === 'catch') {
        return true;
      }

      // Recursively check children
      if (node.body) {
        if (Array.isArray(node.body)) {
          return node.body.some(child => checkErrorHandling(child));
        }
        return checkErrorHandling(node.body);
      }

      return false;
    }
  },
};
