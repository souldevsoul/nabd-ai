/**
 * ESLint Rule: require-project-isolation
 *
 * Ensures complete separation from previous/template projects.
 * Detects leftover artifacts from base templates or other projects.
 *
 * DETECTS:
 * - References to old project names in code
 * - Old project images in public directory
 * - Old branding or terminology
 * - Import paths containing old project references
 *
 * CONFIGURABLE:
 * - templatePatterns: Array of template project names to detect
 * - imagePatterns: Array of image filename patterns (regex strings)
 * - excludePaths: Array of paths to exclude from checking
 *
 * @version 1.23.0
 * @date 2025-11-26
 * @category Project Quality
 */

const fs = require('fs');
const path = require('path');

// Common template project names that might be left over
const DEFAULT_TEMPLATE_PATTERNS = [
  // Common template/starter names
  'template',
  'starter',
  'boilerplate',
  'example-app',
  'demo-app',
  'my-app',
  'your-app',
  'acme',
  'test-project',
  // Known source project names (from project transformations)
  'voicecraft',
  'voice craft',
  'voice revolution',
  'voice generation',
  'voice templates',
  'clipmaster',
  'clip master',
  'formpilot',
  'form pilot',
  'logosmith',
  'logo smith',
  'fashionforge',
  'fashion forge',
  'petportrait',
  'pet portrait',
  'booktrailer',
  'book trailer',
  'propvideo',
  'prop video',
  'tutorbot',
  'tutor bot',
  'coursify',
  'datascope',
  'flowmatic',
  'toonify',
  'reelmatic',
  'nexus',
];

// Common placeholder image patterns
const DEFAULT_IMAGE_PATTERNS = [
  /placeholder.*\.(jpg|png|svg|webp)$/i,
  /sample.*\.(jpg|png|svg|webp)$/i,
  /example.*\.(jpg|png|svg|webp)$/i,
  /dummy.*\.(jpg|png|svg|webp)$/i,
  /test-image.*\.(jpg|png|svg|webp)$/i,
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure complete isolation from previous/template projects',
      category: 'Project Quality',
      recommended: true,
    },
    messages: {
      oldProjectReference: 'Found reference to template/old project "{{pattern}}". Remove all references to previous projects for clean isolation.',
      oldProjectImage: 'Template/placeholder image detected: "{{filename}}". Replace with actual project images.',
      oldProjectImport: 'Import path contains template/old project reference "{{pattern}}". Update to current project structure.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          templatePatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Template/old project names to detect (case-insensitive)',
          },
          imagePatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Image filename patterns to detect (regex strings)',
          },
          excludePaths: {
            type: 'array',
            items: { type: 'string' },
            description: 'Paths to exclude from checking (e.g., migration scripts)',
          },
          checkImages: {
            type: 'boolean',
            default: true,
            description: 'Whether to check for placeholder images',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const templatePatterns = options.templatePatterns || DEFAULT_TEMPLATE_PATTERNS;
    const excludePaths = options.excludePaths || [];
    const checkImages = options.checkImages !== false;
    const filename = context.getFilename();

    // Build image patterns from options or defaults
    let imagePatterns = DEFAULT_IMAGE_PATTERNS;
    if (options.imagePatterns && options.imagePatterns.length > 0) {
      imagePatterns = options.imagePatterns.map(p => new RegExp(p, 'i'));
    }

    // Skip excluded paths
    for (const excludePath of excludePaths) {
      if (filename.includes(excludePath)) {
        return {};
      }
    }

    // Skip node_modules and .next
    if (filename.includes('node_modules') || filename.includes('.next')) {
      return {};
    }

    // Skip eslint config files and this plugin itself
    if (filename.includes('eslint') || filename.includes('plugin')) {
      return {};
    }

    // Track if we've checked public images
    let publicImagesChecked = false;

    function checkPublicImages() {
      if (publicImagesChecked || !checkImages) return [];
      publicImagesChecked = true;

      const issues = [];
      const publicImagesDir = path.join(process.cwd(), 'public', 'images');

      if (fs.existsSync(publicImagesDir)) {
        try {
          const files = fs.readdirSync(publicImagesDir);
          for (const file of files) {
            const filePath = path.join(publicImagesDir, file);

            // Skip directories
            try {
              if (fs.statSync(filePath).isDirectory()) continue;
            } catch {
              continue;
            }

            // Check against image patterns
            for (const pattern of imagePatterns) {
              if (pattern.test(file)) {
                issues.push(file);
                break;
              }
            }
          }
        } catch {
          // Ignore filesystem errors
        }
      }

      return issues;
    }

    return {
      // Check string literals for template/old project references
      // Skip if parent is ImportDeclaration or JSXAttribute (handled separately)
      Literal(node) {
        if (typeof node.value !== 'string') return;
        if (node.value.length < 3) return; // Skip very short strings

        // Skip if this literal is part of import or JSX attribute
        const parent = node.parent;
        if (parent && parent.type === 'ImportDeclaration') return;
        if (parent && parent.type === 'JSXAttribute') return;

        const value = node.value.toLowerCase();

        // Skip URLs and paths that might contain common words
        if (value.startsWith('http') || value.startsWith('/api/')) return;

        for (const pattern of templatePatterns) {
          const lowerPattern = pattern.toLowerCase();
          // Check for word boundaries to avoid false positives
          const regex = new RegExp(`\\b${lowerPattern}\\b`, 'i');
          if (regex.test(value)) {
            context.report({
              node,
              messageId: 'oldProjectReference',
              data: { pattern },
            });
            break;
          }
        }
      },

      // Check template literals
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          const value = quasi.value.raw.toLowerCase();
          for (const pattern of templatePatterns) {
            const lowerPattern = pattern.toLowerCase();
            const regex = new RegExp(`\\b${lowerPattern}\\b`, 'i');
            if (regex.test(value)) {
              context.report({
                node: quasi,
                messageId: 'oldProjectReference',
                data: { pattern },
              });
              break;
            }
          }
        }
      },

      // Check import declarations
      ImportDeclaration(node) {
        const source = node.source.value.toLowerCase();
        for (const pattern of templatePatterns) {
          const lowerPattern = pattern.toLowerCase();
          if (source.includes(lowerPattern)) {
            context.report({
              node: node.source,
              messageId: 'oldProjectImport',
              data: { pattern },
            });
            break;
          }
        }
      },

      // Check for placeholder images at program start (only in layout.tsx)
      Program(node) {
        // Only check in root layout to avoid duplicate reports
        if (!filename.endsWith('app/layout.tsx')) return;

        const oldImages = checkPublicImages();
        for (const imageFile of oldImages) {
          context.report({
            node,
            messageId: 'oldProjectImage',
            data: { filename: imageFile },
          });
        }
      },

      // Check JSX string attributes for image sources
      JSXAttribute(node) {
        if (!node.value || node.value.type !== 'Literal') return;
        if (typeof node.value.value !== 'string') return;

        const attrName = node.name.name;
        if (attrName !== 'src' && attrName !== 'href') return;

        const value = node.value.value.toLowerCase();
        for (const pattern of templatePatterns) {
          const lowerPattern = pattern.toLowerCase();
          if (value.includes(lowerPattern)) {
            context.report({
              node: node.value,
              messageId: 'oldProjectReference',
              data: { pattern },
            });
            break;
          }
        }
      },
    };
  },
};
