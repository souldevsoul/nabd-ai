/**
 * ESLint Rule: require-brand-import
 *
 * Ensures that files using BRAND constant have the proper import statement.
 *
 * This prevents runtime ReferenceError when accessing BRAND properties
 * like BRAND.name.canonical, BRAND.colors, etc.
 *
 * @version 1.0
 * @date 2025-11-20
 *
 * Detects:
 * - BRAND.* property access without import
 * - BRAND as identifier without import
 *
 * Example violations:
 * ❌ logoText={BRAND.name.canonical}  (no import)
 * ❌ const name = BRAND.name           (no import)
 *
 * Example correct usage:
 * ✅ import { BRAND } from "@/lib/brand"
 * ✅ logoText={BRAND.name.canonical}
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require BRAND import when using BRAND constant',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingBrandImport: 'BRAND is used but not imported. Add: import { BRAND } from "@/lib/brand"',
    },
    schema: [],
  },

  create(context) {
    let hasBrandImport = false;
    let brandUsages = [];

    return {
      // Check for BRAND import
      ImportDeclaration(node) {
        // Check if importing BRAND from @/lib/brand
        if (node.source.value === '@/lib/brand') {
          node.specifiers.forEach(spec => {
            if (spec.type === 'ImportSpecifier' && spec.imported.name === 'BRAND') {
              hasBrandImport = true;
            }
          });
        }
      },

      // Check for BRAND usage in member expressions (BRAND.name.canonical)
      MemberExpression(node) {
        if (node.object.type === 'Identifier' && node.object.name === 'BRAND') {
          brandUsages.push(node.object);
        }
        // Handle nested: BRAND.name.canonical
        if (node.object.type === 'MemberExpression' && 
            node.object.object.type === 'Identifier' && 
            node.object.object.name === 'BRAND') {
          brandUsages.push(node.object.object);
        }
      },

      // Check for BRAND usage as identifier (const x = BRAND)
      Identifier(node) {
        if (node.name === 'BRAND') {
          // Skip if it's part of import declaration
          const parent = node.parent;
          if (parent.type === 'ImportSpecifier' || parent.type === 'ImportDeclaration') {
            return;
          }
          // Skip if it's the object in MemberExpression (already handled above)
          if (parent.type === 'MemberExpression' && parent.object === node) {
            return;
          }
          brandUsages.push(node);
        }
      },

      // Report at end of file
      'Program:exit'() {
        if (brandUsages.length > 0 && !hasBrandImport) {
          // Report only once per file (on first usage)
          context.report({
            node: brandUsages[0],
            messageId: 'missingBrandImport',
          });
        }
      },
    };
  },
};
