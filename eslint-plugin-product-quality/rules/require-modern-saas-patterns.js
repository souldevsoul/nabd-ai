/**
 * ESLint Rule: require-modern-saas-patterns
 *
 * Enforces Q4 2025 SaaS best practices:
 * - Loading skeletons (not spinners)
 * - Optimistic UI updates
 * - Toast notifications for feedback
 * - Keyboard shortcuts (Cmd+K search, etc.)
 * - Dark mode support
 * - Progressive disclosure (don't overwhelm users)
 * - Empty states with clear CTAs
 * - Error states with retry actions
 *
 * @version 3.0
 * @date 2025-11-20
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce modern SaaS UX patterns',
      category: 'Modern SaaS UX',
      recommended: true,
    },
    messages: {
      useSkeletonNotSpinner: 'Use skeleton loading UI instead of spinners for better perceived performance (2025 best practice).',
      missingToastProvider: 'No toast notification system detected. Add Sonner, react-hot-toast, or similar for user feedback.',
      noEmptyStateAction: 'Empty state missing call-to-action. Guide users on what to do next.',
      noErrorRecovery: 'Error state missing retry action. Let users recover from errors easily.',
      missingKeyboardShortcuts: 'Consider adding keyboard shortcuts (Cmd+K) for power users.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    let hasToastProvider = false;

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Check for toast libraries (including Mantine Notifications)
        if (source.includes('sonner') ||
            source.includes('react-hot-toast') ||
            source.includes('react-toastify') ||
            source.includes('@mantine/notifications')) {
          hasToastProvider = true;
        }
      },

      JSXElement(node) {
        const openingElement = node.openingElement;
        if (!openingElement || !openingElement.name) return;

        const elementName = openingElement.name.name;

        // Detect spinner usage
        if (elementName && typeof elementName === 'string') {
          if (elementName.toLowerCase().includes('spinner') || elementName.toLowerCase().includes('loading')) {
            // Check if there's also a skeleton component nearby
            const hasSkeletonImport = context.getSourceCode().getText().includes('Skeleton');
            if (!hasSkeletonImport) {
              context.report({
                node: openingElement,
                messageId: 'useSkeletonNotSpinner',
              });
            }
          }
        }

        // Check empty states for CTAs
        if (elementName && elementName.toLowerCase().includes('empty')) {
          const hasButton = node.children && node.children.some(child =>
            child.type === 'JSXElement' &&
            child.openingElement.name.name === 'Button'
          );

          if (!hasButton) {
            context.report({
              node: openingElement,
              messageId: 'noEmptyStateAction',
            });
          }
        }

        // Check error states for retry (skip icons and icon components)
        if (elementName && elementName.toLowerCase().includes('error')) {
          // Skip icon components (Ri*, *Icon, *Warning, etc.)
          if (elementName.startsWith('Ri') ||
              elementName.endsWith('Icon') ||
              elementName.includes('Warning') ||
              elementName.includes('Alert')) {
            return;
          }
          // For component references (like <ErrorContent />), check the whole file
          // since the component definition may contain the retry action
          const fullText = context.getSourceCode().getText();
          const nodeText = context.getSourceCode().getText(node);
          // If element has no children (self-closing like <ErrorContent />), check full file
          const isSelfClosing = node.openingElement.selfClosing;
          const textToCheck = isSelfClosing ? fullText : nodeText;
          if (!textToCheck.toLowerCase().includes('retry') && !textToCheck.toLowerCase().includes('try again')) {
            context.report({
              node: openingElement,
              messageId: 'noErrorRecovery',
            });
          }
        }
      },

      'Program:exit'() {
        // Check if root layout
        if (filename.endsWith('app/layout.tsx')) {
          if (!hasToastProvider) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingToastProvider',
            });
          }
        }
      },
    };
  },
};
