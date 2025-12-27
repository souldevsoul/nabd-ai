/**
 * ESLint Rule: require-responsive-images
 *
 * Images must be responsive and optimized for different screen sizes.
 * Use Next.js Image component with proper sizing or responsive HTML img.
 *
 * @version 1.0
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Images must be responsive and optimized for different screen sizes',
      category: 'Performance',
      recommended: true,
    },
    messages: {
      missingResponsive: 'Image missing responsive attributes. Add width/height or use Next.js Image component with proper sizing.',
      missingFill: 'Next.js Image with layout="fill" or fill prop must be in a positioned container.',
      missingSizes: 'Next.js Image with fill prop should include sizes attribute for optimal loading.',
      hardcodedDimensions: 'Avoid inline style width/height on images. Use responsive CSS or Next.js Image component.',
      noSrcSet: 'Use Next.js Image component or srcset for responsive images instead of plain img tag.',
      missingLoading: 'Large images should use loading="lazy" for better performance.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          enforceNextImage: {
            type: 'boolean',
            default: true,
          },
          requireLazyLoading: {
            type: 'boolean',
            default: true,
          },
          maxWidth: {
            type: 'number',
            default: 800,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const enforceNextImage = options.enforceNextImage !== false;
    const requireLazyLoading = options.requireLazyLoading !== false;
    const maxWidth = options.maxWidth || 800;

    function hasAttribute(attributes, attrName) {
      return attributes.some(attr => attr.name?.name === attrName);
    }

    function getAttributeValue(attributes, attrName) {
      const attr = attributes.find(a => a.name?.name === attrName);
      if (!attr) return null;
      if (attr.value?.type === 'Literal') return attr.value.value;
      if (attr.value?.type === 'JSXExpressionContainer') {
        if (attr.value.expression?.type === 'Literal') {
          return attr.value.expression.value;
        }
      }
      return null;
    }

    return {
      JSXElement(node) {
        const elementName = node.openingElement.name.name;
        const attributes = node.openingElement.attributes;

        // Check plain <img> tags
        if (elementName === 'img') {
          // If enforceNextImage is true, recommend using Next.js Image
          if (enforceNextImage) {
            context.report({
              node,
              messageId: 'noSrcSet',
            });
            return;
          }

          // Check for responsive attributes
          const hasWidth = hasAttribute(attributes, 'width');
          const hasHeight = hasAttribute(attributes, 'height');
          const hasSrcSet = hasAttribute(attributes, 'srcset');
          const hasSizes = hasAttribute(attributes, 'sizes');

          if (!hasWidth || !hasHeight) {
            context.report({
              node,
              messageId: 'missingResponsive',
            });
          }

          // Check for lazy loading on large images
          if (requireLazyLoading) {
            const width = getAttributeValue(attributes, 'width');
            const hasLazyLoading = hasAttribute(attributes, 'loading');

            if (width && width > maxWidth && !hasLazyLoading) {
              context.report({
                node,
                messageId: 'missingLoading',
              });
            }
          }

          // Check for inline styles
          const styleAttr = attributes.find(attr => attr.name?.name === 'style');
          if (styleAttr && styleAttr.value?.type === 'JSXExpressionContainer') {
            const styleObj = styleAttr.value.expression;
            if (styleObj?.type === 'ObjectExpression') {
              const hasStyleWidth = styleObj.properties.some(
                prop => prop.key?.name === 'width'
              );
              const hasStyleHeight = styleObj.properties.some(
                prop => prop.key?.name === 'height'
              );

              if (hasStyleWidth || hasStyleHeight) {
                context.report({
                  node: styleAttr,
                  messageId: 'hardcodedDimensions',
                });
              }
            }
          }
        }

        // Check Next.js Image component
        if (elementName === 'Image') {
          const hasFill = hasAttribute(attributes, 'fill');
          const hasWidth = hasAttribute(attributes, 'width');
          const hasHeight = hasAttribute(attributes, 'height');
          const hasSizes = hasAttribute(attributes, 'sizes');

          // Image must have either fill OR width+height
          if (!hasFill && (!hasWidth || !hasHeight)) {
            context.report({
              node,
              messageId: 'missingResponsive',
            });
          }

          // Image with fill should have sizes
          if (hasFill && !hasSizes) {
            context.report({
              node,
              messageId: 'missingSizes',
            });
          }
        }
      },
    };
  },
};
