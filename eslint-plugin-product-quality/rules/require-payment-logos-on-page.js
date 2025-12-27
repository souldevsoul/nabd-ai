/**
 * ESLint Rule: require-payment-logos-on-page
 *
 * Ensures payment logos (Visa/Mastercard) are displayed on pricing or checkout pages.
 * Payment processors require visible payment method logos for compliance.
 *
 * Based on payment-compliance-audit.skill requirements:
 * - Logos must be on main page (homepage or pricing)
 * - Must be visible (above the fold or in payment section)
 * - Required for Visa/Mastercard compliance
 *
 * @version 1.0.0
 * @date 2025-11-24
 * @category Payment Compliance
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure payment logos are displayed on pricing/checkout pages',
      category: 'Payment Compliance',
      recommended: true,
    },
    messages: {
      missingPaymentLogos: 'Pricing/checkout page should display payment method logos (Visa, Mastercard). Add payment logos to build trust and meet compliance requirements.',
      missingVisaLogo: 'Missing Visa logo on payment page. Add <Image src="/images/payments/visa.svg" /> for compliance.',
      missingMastercardLogo: 'Missing Mastercard logo on payment page. Add <Image src="/images/payments/mastercard.svg" /> for compliance.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireVisa: {
            type: 'boolean',
            default: true,
          },
          requireMastercard: {
            type: 'boolean',
            default: true,
          },
          pricingPaths: {
            type: 'array',
            items: { type: 'string' },
            default: ['/pricing', '/checkout', '/payment', '/subscribe'],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const requireVisa = options.requireVisa !== false;
    const requireMastercard = options.requireMastercard !== false;
    const pricingPaths = options.pricingPaths || ['/pricing', '/checkout', '/payment', '/subscribe'];

    const filename = context.getFilename();

    // Check if this is a pricing/checkout page
    const isPricingPage = pricingPaths.some(pagePath => {
      const normalizedPath = filename.replace(/\\/g, '/');
      return normalizedPath.includes(`/app${pagePath}/page.`) ||
             normalizedPath.includes(`/pages${pagePath}.`) ||
             normalizedPath.includes(`${pagePath}/page.`);
    });

    if (!isPricingPage) {
      return {};
    }

    let hasVisaLogo = false;
    let hasMastercardLogo = false;
    let programNode = null;

    return {
      Program(node) {
        programNode = node;
      },

      // Check Image components for payment logos
      JSXOpeningElement(node) {
        const elementName = node.name.name || (node.name.object && node.name.object.name);

        if (elementName !== 'Image' && elementName !== 'img') {
          return;
        }

        const srcAttr = node.attributes.find(
          attr => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'src'
        );

        if (!srcAttr || !srcAttr.value) return;

        let srcValue = '';

        if (srcAttr.value.type === 'Literal') {
          srcValue = srcAttr.value.value || '';
        } else if (srcAttr.value.type === 'JSXExpressionContainer') {
          const expr = srcAttr.value.expression;
          if (expr.type === 'Literal') {
            srcValue = expr.value || '';
          } else if (expr.type === 'TemplateLiteral' && expr.quasis.length === 1) {
            srcValue = expr.quasis[0].value.cooked || '';
          }
        }

        const lowerSrc = srcValue.toLowerCase();

        if (lowerSrc.includes('visa')) {
          hasVisaLogo = true;
        }
        if (lowerSrc.includes('mastercard')) {
          hasMastercardLogo = true;
        }
      },

      // Also check string literals for payment logo references
      Literal(node) {
        if (typeof node.value !== 'string') return;

        const lowerValue = node.value.toLowerCase();

        if (lowerValue.includes('/visa') || lowerValue.includes('visa.svg')) {
          hasVisaLogo = true;
        }
        if (lowerValue.includes('/mastercard') || lowerValue.includes('mastercard.svg')) {
          hasMastercardLogo = true;
        }
      },

      'Program:exit'() {
        if (!programNode) return;

        // Report missing logos
        if (requireVisa && !hasVisaLogo) {
          context.report({
            node: programNode,
            messageId: 'missingVisaLogo',
          });
        }

        if (requireMastercard && !hasMastercardLogo) {
          context.report({
            node: programNode,
            messageId: 'missingMastercardLogo',
          });
        }
      },
    };
  },
};
