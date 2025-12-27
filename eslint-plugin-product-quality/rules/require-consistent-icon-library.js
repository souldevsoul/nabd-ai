/**
 * @fileoverview Require consistent icon library usage throughout the project
 * @author AutoQA
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce using a single icon library throughout the project (no mixing)',
      category: 'Quality',
      recommended: true,
    },
    messages: {
      mixedIconLibraries: 'Mixing icon libraries detected. Found {{found}} but config specifies {{expected}}. Use only ONE icon library throughout the project for consistency.',
      prohibitedLibrary: 'Icon library "{{library}}" is prohibited. Use "{{allowed}}" instead as configured in your brand guide.',
      useConfiguredLibrary: 'Import icons from "{{library}}" as specified in your brand configuration.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          library: {
            type: 'string',
            description: 'Approved icon library package name',
          },
          allowedImports: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of allowed import sources for icons',
          },
          prohibitedLibraries: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of icon libraries that should not be used',
          },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {}
    const approvedLibrary = options.library || 'lucide-react'
    const allowedImports = options.allowedImports || [approvedLibrary]
    const prohibitedLibraries = options.prohibitedLibraries || [
      'react-icons',
      'react-icons/ai',
      'react-icons/bi',
      'react-icons/bs',
      'react-icons/cg',
      'react-icons/di',
      'react-icons/fa',
      'react-icons/fc',
      'react-icons/fi',
      'react-icons/gi',
      'react-icons/go',
      'react-icons/gr',
      'react-icons/hi',
      'react-icons/im',
      'react-icons/io',
      'react-icons/io5',
      'react-icons/md',
      'react-icons/ri',
      'react-icons/si',
      'react-icons/tb',
      'react-icons/ti',
      'react-icons/vsc',
      'react-icons/wi',
    ]

    // Common icon library patterns
    const iconLibraryPatterns = [
      'lucide-react',
      '@heroicons/react',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      '@heroicons/react/20/solid',
      'react-feather',
      'phosphor-react',
      '@phosphor-icons/react',
      'react-icons',
    ]

    const foundLibraries = new Set()

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value

        // Check if this is an icon library import
        const isIconLibrary = iconLibraryPatterns.some(pattern =>
          importSource.includes(pattern)
        )

        if (!isIconLibrary) {
          return
        }

        // Check if it's a prohibited library
        const isProhibited = prohibitedLibraries.some(prohibited =>
          importSource.includes(prohibited)
        )

        if (isProhibited) {
          context.report({
            node,
            messageId: 'prohibitedLibrary',
            data: {
              library: importSource,
              allowed: approvedLibrary,
            },
          })
          return
        }

        // Check if it's an allowed library
        const isAllowed = allowedImports.some(allowed =>
          importSource.includes(allowed)
        )

        if (!isAllowed) {
          foundLibraries.add(importSource)

          context.report({
            node,
            messageId: 'mixedIconLibraries',
            data: {
              found: importSource,
              expected: approvedLibrary,
            },
          })
        }
      },
    }
  },
}
