/**
 * Payment Logos Library - Official Brand-Compliant Assets
 *
 * This library contains metadata and validation for official payment system logos.
 * All logos are from trusted sources (Simple Icons, SVG Repo) and comply with
 * official brand guidelines from Visa, Mastercard, Apple, Google, etc.
 *
 * IMPORTANT: These logos must NOT be generated or modified.
 * They are official brand assets from verified sources.
 *
 * @version 1.0.0
 * @see https://simpleicons.org/
 * @see https://svgrepo.com/
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Official payment logos registry
 * Each logo includes:
 * - filename: Expected filename in /images/payments/
 * - md5: MD5 hash of official SVG content
 * - size: File size in bytes (for quick validation)
 * - source: Trusted source URL
 * - brandGuidelines: Official brand guidelines URL
 * - colors: Official brand colors
 */
const OFFICIAL_LOGOS = {
  visa: {
    filename: 'visa.svg',
    altFilenames: [], // No alternatives
    md5: '0533c456bc3b219b93d0a28e5d1b0cb5',
    minSize: 200, // Relaxed: Simple Icons versions are smaller
    source: 'https://simpleicons.org/',
    brandGuidelines: 'https://corporate.visa.com/en/about-visa/brand.html',
    colors: ['#1434CB'],
    description: 'Visa Blue wordmark',
  },
  mastercard: {
    filename: 'mastercard.svg',
    altFilenames: [],
    md5: '66637198898900bb657f29e9d32e31e8',
    minSize: 200, // Relaxed: Simple Icons versions are smaller
    source: 'https://simpleicons.org/',
    brandGuidelines: 'https://www.mastercard.com/brandcenter/ca/en/brand-requirements/mastercard.html',
    colors: ['#EB001B', '#F79E1B', '#FF5F00'],
    description: 'Mastercard interlocking circles with wordmark',
  },
  'apple-pay': {
    filename: 'apple-pay.svg',
    altFilenames: ['applepay.svg'],
    md5: '58b7f54d4a7fda4a3de74f8ddb7740b6',
    minSize: 2000,
    source: 'https://svgrepo.com/',
    brandGuidelines: 'https://developer.apple.com/apple-pay/marketing/',
    colors: ['#000000'],
    description: 'Apple Pay official wordmark badge',
  },
  'google-pay': {
    filename: 'google-pay.svg',
    altFilenames: ['googlepay.svg'],
    md5: '149839023138dafceb64efd9ff9b91c3',
    minSize: 1000,
    source: 'https://simpleicons.org/',
    brandGuidelines: 'https://developers.google.com/pay/api/web/guides/brand-guidelines',
    colors: ['#5F6368', '#4285F4', '#34A853', '#FBBC04', '#EA4335'],
    description: 'Google Pay official wordmark with G colors',
  },
  amex: {
    filename: 'amex.svg',
    altFilenames: ['american-express.svg'],
    md5: '975044e4b22417550f15fc8a60d48bb9',
    minSize: 800,
    source: 'https://simpleicons.org/',
    brandGuidelines: 'https://www.americanexpress.com/us/merchant/merchant-branding.html',
    colors: ['#006FCF'],
    description: 'American Express Blue Box',
  },
  paypal: {
    filename: 'paypal.svg',
    altFilenames: [],
    md5: 'f67bd44f1dea6c719721ed4eb59ff56c',
    minSize: 1000,
    source: 'https://simpleicons.org/',
    brandGuidelines: 'https://www.paypal.com/us/webapps/mpp/logo-center',
    colors: ['#003087', '#009CDE', '#012169'],
    description: 'PayPal official wordmark',
  },
  stripe: {
    filename: 'stripe.svg',
    altFilenames: [],
    md5: '1a4b7105eecb9469f9879e6b046f85d2',
    minSize: 400,
    source: 'https://simpleicons.org/',
    brandGuidelines: 'https://stripe.com/newsroom/brand-assets',
    colors: ['#635BFF'],
    description: 'Stripe wordmark',
  },
};

/**
 * Get the path to the assets directory containing official logos
 */
function getAssetsPath() {
  return path.join(__dirname, '..', 'assets', 'payment-logos');
}

/**
 * Calculate MD5 hash of file content
 */
function calculateMD5(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Validate a payment logo file against official specs
 *
 * @param {string} filePath - Path to the SVG file
 * @param {string} logoName - Name of the logo (visa, mastercard, etc.)
 * @returns {Object} Validation result { valid: boolean, errors: string[], warnings: string[] }
 */
function validateLogo(filePath, logoName) {
  const result = { valid: true, errors: [], warnings: [] };

  // Normalize logo name
  const normalizedName = logoName.toLowerCase().replace(/[_\s]/g, '-');

  // Find matching logo spec
  let logoSpec = OFFICIAL_LOGOS[normalizedName];

  // Check alternative filenames
  if (!logoSpec) {
    for (const [key, spec] of Object.entries(OFFICIAL_LOGOS)) {
      if (spec.altFilenames && spec.altFilenames.some(alt =>
        normalizedName.includes(alt.replace('.svg', '')) ||
        alt.replace('.svg', '').includes(normalizedName.replace('.svg', ''))
      )) {
        logoSpec = spec;
        break;
      }
    }
  }

  if (!logoSpec) {
    result.warnings.push(`Unknown payment logo: ${logoName}. Consider using official logos from AutoQA library.`);
    return result;
  }

  try {
    if (!fs.existsSync(filePath)) {
      result.valid = false;
      result.errors.push(`File not found: ${filePath}`);
      return result;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fileSize = Buffer.byteLength(content, 'utf8');
    const fileMD5 = calculateMD5(content);

    // Check file size
    if (fileSize < logoSpec.minSize) {
      result.valid = false;
      result.errors.push(
        `File too small (${fileSize} bytes). Official ${logoName} logo should be >= ${logoSpec.minSize} bytes. ` +
        `This may indicate a simplified/fake logo. Use official logo from: ${logoSpec.source}`
      );
    }

    // Check MD5 hash (warning only - logo might be legitimately different version)
    if (fileMD5 !== logoSpec.md5) {
      result.warnings.push(
        `Logo hash mismatch. File may not be the official ${logoName} logo from ${logoSpec.source}. ` +
        `Run 'npx autoqa-init-logos' to install official logos.`
      );
    }

  } catch (error) {
    result.valid = false;
    result.errors.push(`Error reading file: ${error.message}`);
  }

  return result;
}

/**
 * Copy official logos to project's public/images/payments/ directory
 *
 * @param {string} projectRoot - Path to project root
 * @param {Object} options - { overwrite: boolean, logos: string[] }
 * @returns {Object} Result { copied: string[], skipped: string[], errors: string[] }
 */
function installOfficialLogos(projectRoot, options = {}) {
  const { overwrite = false, logos = Object.keys(OFFICIAL_LOGOS) } = options;
  const result = { copied: [], skipped: [], errors: [] };

  const assetsPath = getAssetsPath();
  const targetPath = path.join(projectRoot, 'public', 'images', 'payments');

  // Create target directory if needed
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  for (const logoName of logos) {
    const spec = OFFICIAL_LOGOS[logoName];
    if (!spec) {
      result.errors.push(`Unknown logo: ${logoName}`);
      continue;
    }

    const sourcePath = path.join(assetsPath, spec.filename);
    const destPath = path.join(targetPath, spec.filename);

    try {
      if (!fs.existsSync(sourcePath)) {
        result.errors.push(`Source logo not found: ${sourcePath}`);
        continue;
      }

      if (fs.existsSync(destPath) && !overwrite) {
        result.skipped.push(spec.filename);
        continue;
      }

      fs.copyFileSync(sourcePath, destPath);
      result.copied.push(spec.filename);

    } catch (error) {
      result.errors.push(`Error copying ${spec.filename}: ${error.message}`);
    }
  }

  return result;
}

/**
 * Get list of all official logos
 */
function getOfficialLogos() {
  return Object.entries(OFFICIAL_LOGOS).map(([key, spec]) => ({
    name: key,
    ...spec,
  }));
}

module.exports = {
  OFFICIAL_LOGOS,
  getAssetsPath,
  calculateMD5,
  validateLogo,
  installOfficialLogos,
  getOfficialLogos,
};
