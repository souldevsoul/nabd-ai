/**
 * @fileoverview Prevent emojis in UI components (unprofessional, inconsistent rendering)
 * @author AutoQA
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent emojis in UI components - use proper icon components instead',
      category: 'Quality',
      recommended: true,
    },
    messages: {
      noEmojis: 'Emojis not allowed in UI ({{location}}). Use proper icon components from your chosen icon library instead. Emojis are unprofessional, render inconsistently across devices, and cause accessibility issues.',
    },
    schema: [],
    fixable: 'code',
  },

  create(context) {
    // Emoji regex pattern (covers most common emojis)
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]/gu

    // Remove all emojis from text
    function removeEmojis(text) {
      return text.replace(emojiRegex, '').replace(/\s+/g, ' ').trim()
    }

    function checkForEmojis(node, text, location) {
      if (emojiRegex.test(text)) {
        context.report({
          node,
          messageId: 'noEmojis',
          data: { location },
          fix(fixer) {
            // Auto-fix: remove emojis from the text
            const cleanText = removeEmojis(text)
            if (node.type === 'JSXText') {
              return fixer.replaceText(node, cleanText || ' ')
            } else if (node.type === 'Literal') {
              return fixer.replaceText(node, `"${cleanText}"`)
            }
            return null
          },
        })
      }
    }

    return {
      JSXText(node) {
        const text = node.value
        if (text && text.trim()) {
          checkForEmojis(node, text, 'JSX text content')
        }
      },

      Literal(node) {
        // Check string literals that might contain emojis
        if (typeof node.value === 'string') {
          const text = node.value

          // Check if this literal is in JSX context
          const parent = node.parent
          if (parent && (parent.type === 'JSXAttribute' || parent.type === 'JSXExpressionContainer')) {
            checkForEmojis(node, text, 'JSX attribute or expression')
          }
        }
      },

      TemplateLiteral(node) {
        // Check template literals in JSX
        const parent = node.parent
        if (parent && parent.type === 'JSXExpressionContainer') {
          node.quasis.forEach(quasi => {
            if (quasi.value && quasi.value.raw) {
              checkForEmojis(quasi, quasi.value.raw, 'template literal in JSX')
            }
          })
        }
      },
    }
  },
}
