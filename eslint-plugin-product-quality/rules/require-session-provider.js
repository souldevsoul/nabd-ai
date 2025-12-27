/**
 * ESLint Rule: require-session-provider
 *
 * Ensures that the root layout.tsx includes SessionProvider or AuthProvider
 * for proper authentication state management across the application.
 *
 * Without SessionProvider, useSession() hooks won't work and auth state
 * won't be available to components.
 *
 * @author Senior QA Engineer
 * @version 1.24.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Root layout must include SessionProvider or AuthProvider for auth state',
      category: 'Security',
      recommended: true,
    },
    messages: {
      missingSessionProvider:
        'Root layout must wrap children with SessionProvider or AuthProvider for authentication to work. Add: import { SessionProvider } from "next-auth/react"',
      missingAuthProvider:
        'Root layout should include an auth provider wrapper. Consider adding SessionProvider from next-auth/react or a custom AuthProvider.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only check root layout files
    const isRootLayout =
      (filename.endsWith('/app/layout.tsx') ||
        filename.endsWith('/app/layout.jsx') ||
        filename.endsWith('/app/layout.js') ||
        filename.endsWith('\\app\\layout.tsx') ||
        filename.endsWith('\\app\\layout.jsx') ||
        filename.endsWith('\\app\\layout.js')) &&
      !filename.includes('/(') && // Skip route groups like /(auth)/layout.tsx
      !filename.includes('/dashboard/') &&
      !filename.includes('/admin/');

    if (!isRootLayout) {
      return {};
    }

    let hasSessionProviderImport = false;
    let hasAuthProviderImport = false;
    let hasSessionProviderUsage = false;
    let hasAuthProviderUsage = false;
    let hasProvidersComponent = false;

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Check for SessionProvider import from next-auth
        if (source.includes('next-auth')) {
          node.specifiers.forEach((specifier) => {
            const importedName = specifier.imported?.name || specifier.local?.name || '';
            if (importedName === 'SessionProvider') {
              hasSessionProviderImport = true;
            }
          });
        }

        // Check for custom AuthProvider or Providers import
        if (
          source.includes('AuthProvider') ||
          source.includes('auth-provider') ||
          source.includes('/providers')
        ) {
          hasAuthProviderImport = true;
        }

        // Check for Providers component import (common pattern)
        node.specifiers.forEach((specifier) => {
          const localName = specifier.local?.name || '';
          if (localName === 'Providers' || localName === 'AuthProvider') {
            hasProvidersComponent = true;
          }
        });
      },

      JSXElement(node) {
        const elementName =
          node.openingElement.name.name ||
          (node.openingElement.name.object && node.openingElement.name.object.name);

        // Check for SessionProvider usage
        if (elementName === 'SessionProvider') {
          hasSessionProviderUsage = true;
        }

        // Check for AuthProvider or Providers usage
        if (elementName === 'AuthProvider' || elementName === 'Providers') {
          hasAuthProviderUsage = true;
        }
      },

      'Program:exit'(node) {
        // Skip if any provider is found
        if (
          hasSessionProviderImport ||
          hasSessionProviderUsage ||
          hasAuthProviderImport ||
          hasAuthProviderUsage ||
          hasProvidersComponent
        ) {
          return;
        }

        // Check if the file has actual layout content
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText();

        // Only report if this looks like a real layout file with children
        const hasLayoutContent =
          text.includes('children') && (text.includes('return') || text.includes('=>'));

        // Check if project uses next-auth (has auth-related imports elsewhere)
        const usesAuth =
          text.includes('useSession') ||
          text.includes('getServerSession') ||
          text.includes('next-auth');

        if (hasLayoutContent) {
          // If the project clearly uses auth, require SessionProvider
          if (usesAuth) {
            context.report({
              node: node,
              loc: { line: 1, column: 0 },
              messageId: 'missingSessionProvider',
            });
          }
          // Otherwise, just suggest adding an auth provider
          // This is a softer warning - not all projects need auth
        }
      },
    };
  },
};
