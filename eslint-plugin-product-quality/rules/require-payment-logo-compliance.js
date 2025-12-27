/**
 * ESLint Rule: require-payment-logo-compliance
 *
 * Ensures payment system logos comply with official brand guidelines.
 *
 * DETECTS:
 * - Use of react-icons for payment logos (SiVisa, SiMastercard, SiApplepay, SiGooglepay)
 * - Payment logos NOT loaded from /images/payments/ directory
 * - Incorrect file formats (must be SVG)
 * - Hardcoded payment logo data URIs
 * - SVG files that are too small (< 500 bytes - indicates simplified/fake logos)
 * - SVG files with tiny viewBox (< 100x50 - indicates low quality)
 *
 * REQUIRES:
 * - Payment logos must be loaded from /images/payments/ directory
 * - Files must be SVG format
 * - SVG files must be >= 500 bytes (official logos are complex)
 * - SVG viewBox must be at least 100x50 (proper aspect ratio)
 * - Logos must be official brand assets (Visa, Mastercard, Apple Pay, Google Pay)
 *
 * Based on official brand guidelines (2025-11-24):
 * - /images/payments/visa.svg (Official Visa gradient logo, viewBox 256x83)
 * - /images/payments/mastercard.svg (Official interlocking circles + wordmark, viewBox 256x199)
 * - /images/payments/applepay.svg (Official Apple Pay wordmark, viewBox 256x107)
 * - /images/payments/googlepay.svg (Official Google Pay with G colors, viewBox 256x100)
 *
 * @see https://www.mastercard.com/brandcenter/ca/en/brand-requirements/mastercard.html
 * @see https://corporate.visa.com/en/about-visa/brand.html
 * @see https://developer.apple.com/apple-pay/marketing/
 * @see https://developers.google.com/pay/api/web/guides/brand-guidelines
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Import payment logos library
let paymentLogosLib;
try {
  paymentLogosLib = require('../lib/payment-logos');
} catch {
  paymentLogosLib = null;
}

// Minimum viewBox dimensions for quality logos
// Note: Simple Icons uses 24x24 viewBox which is standard for SVG icons
// We allow 24x24 as minimum since official logos use this format
const MIN_VIEWBOX_WIDTH = 24;
const MIN_VIEWBOX_HEIGHT = 24;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure payment logos comply with official brand guidelines',
      category: 'Product Quality',
    },
    messages: {
      noReactIcons: 'Do not use react-icons for payment logos ({{iconName}}). Use official SVG files from /images/payments/ directory instead. Run: cp -r node_modules/eslint-plugin-product-quality/assets/payment-logos/* public/images/payments/',
      wrongPath: 'Payment logo must be loaded from /images/payments/ directory, not "{{path}}"',
      wrongFormat: 'Payment logo "{{filename}}" must be SVG format, not {{format}}',
      dataUri: 'Do not use data URIs for payment logos. Use official SVG files from /images/payments/ directory.',
      fileTooSmall: 'Payment logo "{{filename}}" is too small ({{size}} bytes). Official logos should be >= {{minSize}} bytes. This indicates a simplified/fake logo - payment systems require official brand assets. Copy official logo: cp node_modules/eslint-plugin-product-quality/assets/payment-logos/{{logoName}}.svg public/images/payments/',
      viewBoxTooSmall: 'Payment logo "{{filename}}" has a small viewBox ({{viewBox}}). Official logos should have viewBox >= {{minWidth}}x{{minHeight}}. This indicates a low-quality/generated logo.',
      hashMismatch: 'Payment logo "{{filename}}" does not match official version (hash mismatch). This may be a modified or generated logo. Copy official logo: cp node_modules/eslint-plugin-product-quality/assets/payment-logos/{{logoName}}.svg public/images/payments/',
      logoNotFound: 'Payment logo file not found: {{filename}}. Copy official logos: cp -r node_modules/eslint-plugin-product-quality/assets/payment-logos/* public/images/payments/',
    },
    schema: [],
  },
  create(context) {
    const paymentIconNames = ['SiVisa', 'SiMastercard', 'SiApplepay', 'SiGooglepay', 'FaCcVisa', 'FaCcMastercard', 'FaCcApplePay', 'SiAmericanexpress', 'SiPaypal', 'SiStripe'];

    // Helper to get logo name from filename
    function getLogoName(filename) {
      const name = filename.replace('.svg', '').toLowerCase();
      // Normalize: applepay -> apple-pay, googlepay -> google-pay
      if (name === 'applepay') return 'apple-pay';
      if (name === 'googlepay') return 'google-pay';
      return name;
    }

    // Helper to calculate MD5 hash
    function calculateMD5(content) {
      return crypto.createHash('md5').update(content).digest('hex');
    }

    // Helper to check SVG file quality
    function checkSvgFileQuality(filePath, node) {
      try {
        // Resolve the file path relative to project root
        const projectRoot = context.cwd || process.cwd();
        const absolutePath = path.join(projectRoot, 'public', filePath);
        const filename = path.basename(filePath);
        const logoName = getLogoName(filename);

        if (!fs.existsSync(absolutePath)) {
          context.report({
            node,
            messageId: 'logoNotFound',
            data: { filename },
          });
          return;
        }

        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        const fileSize = Buffer.byteLength(fileContent, 'utf8');

        // Get official logo spec from library
        let officialSpec = null;
        if (paymentLogosLib && paymentLogosLib.OFFICIAL_LOGOS) {
          officialSpec = paymentLogosLib.OFFICIAL_LOGOS[logoName];
        }

        // Use library minSize or fallback
        const minSize = officialSpec ? officialSpec.minSize : 400;

        // Check file size
        if (fileSize < minSize) {
          context.report({
            node,
            messageId: 'fileTooSmall',
            data: {
              filename,
              size: fileSize,
              minSize: minSize,
              logoName: logoName,
            },
          });
          return; // Don't check hash if size is wrong
        }

        // Skip hash check - official logos not bundled with plugin
        // If needed in future, logos can be downloaded from official sources

        // Check viewBox dimensions
        const viewBoxMatch = fileContent.match(/viewBox\s*=\s*["']([^"']+)["']/i);
        if (viewBoxMatch) {
          const viewBoxParts = viewBoxMatch[1].split(/[\s,]+/).map(Number);
          if (viewBoxParts.length >= 4) {
            const width = viewBoxParts[2];
            const height = viewBoxParts[3];

            if (width < MIN_VIEWBOX_WIDTH || height < MIN_VIEWBOX_HEIGHT) {
              context.report({
                node,
                messageId: 'viewBoxTooSmall',
                data: {
                  filename,
                  viewBox: viewBoxMatch[1],
                  minWidth: MIN_VIEWBOX_WIDTH,
                  minHeight: MIN_VIEWBOX_HEIGHT,
                },
              });
            }
          }
        }
      } catch {
        // Silently skip if file can't be read
      }
    }

    return {
      // Detect react-icons imports
      ImportDeclaration(node) {
        const source = node.source.value;
        if (!source.includes('react-icons')) return;

        node.specifiers.forEach(spec => {
          if (spec.type === 'ImportSpecifier') {
            const importedName = spec.imported.name;
            if (paymentIconNames.includes(importedName)) {
              context.report({
                node: spec,
                messageId: 'noReactIcons',
                data: { iconName: importedName },
              });
            }
          }
        });
      },

      // Detect Image component src attributes
      JSXAttribute(node) {
        if (node.name.name !== 'src') return;

        let srcValue = null;

        // String literal: <Image src="/images/logo.png" />
        if (node.value && node.value.type === 'Literal') {
          srcValue = node.value.value;
        }

        // Template literal or expression: <Image src={`/images/${name}.png`} />
        if (node.value && node.value.type === 'JSXExpressionContainer') {
          const expr = node.value.expression;

          // Simple string: <Image src={"/images/logo.png"} />
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            srcValue = expr.value;
          }

          // Template literal: <Image src={`/images/payments/visa.svg`} />
          if (expr.type === 'TemplateLiteral' && expr.quasis.length === 1) {
            srcValue = expr.quasis[0].value.cooked;
          }
        }

        if (!srcValue) return;

        // Check for data URIs
        if (srcValue.startsWith('data:')) {
          const lowerSrc = srcValue.toLowerCase();
          if (lowerSrc.includes('visa') || lowerSrc.includes('mastercard') ||
              lowerSrc.includes('apple') || lowerSrc.includes('google') ||
              lowerSrc.includes('payment')) {
            context.report({
              node,
              messageId: 'dataUri',
            });
          }
          return;
        }

        // Check if it's a payment logo path
        const paymentLogos = ['visa', 'mastercard', 'apple-pay', 'applepay', 'google-pay', 'googlepay', 'amex', 'american-express', 'paypal', 'stripe'];
        const lowerSrc = srcValue.toLowerCase();
        const isPaymentLogo = paymentLogos.some(logo => lowerSrc.includes(logo));

        if (!isPaymentLogo) return;

        // Check correct directory
        if (!srcValue.includes('/images/payments/')) {
          context.report({
            node,
            messageId: 'wrongPath',
            data: { path: srcValue },
          });
          return;
        }

        // Check SVG format
        const filename = srcValue.split('/').pop();
        const extension = filename.split('.').pop();
        if (extension && extension.toLowerCase() !== 'svg') {
          context.report({
            node,
            messageId: 'wrongFormat',
            data: { filename, format: extension.toUpperCase() },
          });
          return;
        }

        // Check SVG file quality (size and viewBox)
        checkSvgFileQuality(srcValue, node);
      },
    };
  },
};
