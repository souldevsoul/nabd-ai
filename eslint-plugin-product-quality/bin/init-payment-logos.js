#!/usr/bin/env node

/**
 * CLI Command: init-payment-logos
 *
 * Installs official payment system logos from AutoQA library to project.
 * These logos comply with official brand guidelines:
 * - Visa: https://corporate.visa.com/en/about-visa/brand.html
 * - Mastercard: https://www.mastercard.com/brandcenter/
 * - Apple Pay: https://developer.apple.com/apple-pay/marketing/
 * - Google Pay: https://developers.google.com/pay/api/web/guides/brand-guidelines
 *
 * Usage:
 *   npx eslint-plugin-product-quality init-logos
 *   npm exec -- eslint-plugin-product-quality init-logos
 *
 * Options:
 *   --output-dir <path>  Output directory (default: public/images/payments)
 *   --force              Overwrite existing files
 *   --list               List available logos without installing
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Import payment logos library
const paymentLogosLib = require('../lib/payment-logos');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseArgs(args) {
  const options = {
    outputDir: 'public/images/payments',
    force: false,
    list: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--output-dir' || arg === '-o') {
      options.outputDir = args[++i];
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else if (arg === '--list' || arg === '-l') {
      options.list = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
${colors.cyan}init-payment-logos${colors.reset} - Install official payment system logos

${colors.yellow}Usage:${colors.reset}
  npx eslint-plugin-product-quality init-logos [options]

${colors.yellow}Options:${colors.reset}
  -o, --output-dir <path>  Output directory (default: public/images/payments)
  -f, --force              Overwrite existing files
  -l, --list               List available logos without installing
  -h, --help               Show this help message

${colors.yellow}Examples:${colors.reset}
  npx eslint-plugin-product-quality init-logos
  npx eslint-plugin-product-quality init-logos --output-dir assets/payments
  npx eslint-plugin-product-quality init-logos --force

${colors.yellow}Available Logos:${colors.reset}
  visa.svg, mastercard.svg, apple-pay.svg, google-pay.svg,
  amex.svg, paypal.svg, stripe.svg

${colors.dim}These logos are sourced from Simple Icons (https://simpleicons.org/)
and comply with official brand guidelines.${colors.reset}
`);
}

function listLogos() {
  console.log(`\n${colors.cyan}Available Payment Logos:${colors.reset}\n`);

  const logos = paymentLogosLib.OFFICIAL_LOGOS;
  for (const [name, spec] of Object.entries(logos)) {
    console.log(`  ${colors.green}${spec.filename}${colors.reset}`);
    console.log(`    Source: ${spec.source}`);
    console.log(`    Guidelines: ${spec.brandGuidelines}`);
    console.log(`    MD5: ${spec.md5}`);
    console.log('');
  }
}

function calculateMD5(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

function installLogos(options) {
  const projectRoot = process.cwd();
  const outputDir = path.join(projectRoot, options.outputDir);
  const assetsDir = path.join(__dirname, '..', 'assets', 'payment-logos');

  // Check if assets directory exists
  if (!fs.existsSync(assetsDir)) {
    log(`Error: Assets directory not found: ${assetsDir}`, 'red');
    log('Please ensure eslint-plugin-product-quality is installed correctly.', 'yellow');
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    log(`Created directory: ${options.outputDir}`, 'green');
  }

  const logos = paymentLogosLib.OFFICIAL_LOGOS;
  let installed = 0;
  let skipped = 0;
  let updated = 0;

  console.log(`\n${colors.cyan}Installing payment logos to ${options.outputDir}...${colors.reset}\n`);

  for (const [name, spec] of Object.entries(logos)) {
    const srcPath = path.join(assetsDir, spec.filename);
    const destPath = path.join(outputDir, spec.filename);

    // Check if source file exists
    if (!fs.existsSync(srcPath)) {
      log(`  Warning: Source file not found: ${spec.filename}`, 'yellow');
      continue;
    }

    const srcContent = fs.readFileSync(srcPath, 'utf8');
    const srcMD5 = calculateMD5(srcContent);

    // Check if destination exists
    if (fs.existsSync(destPath)) {
      const destContent = fs.readFileSync(destPath, 'utf8');
      const destMD5 = calculateMD5(destContent);

      if (srcMD5 === destMD5) {
        log(`  ✓ ${spec.filename} (already up to date)`, 'dim');
        skipped++;
        continue;
      }

      if (!options.force) {
        log(`  ⚠ ${spec.filename} exists with different content (use --force to overwrite)`, 'yellow');
        skipped++;
        continue;
      }

      // Overwrite with force
      fs.copyFileSync(srcPath, destPath);
      log(`  ↻ ${spec.filename} (updated)`, 'green');
      updated++;
    } else {
      // Install new file
      fs.copyFileSync(srcPath, destPath);
      log(`  + ${spec.filename} (installed)`, 'green');
      installed++;
    }
  }

  console.log(`
${colors.cyan}Summary:${colors.reset}
  Installed: ${installed}
  Updated: ${updated}
  Skipped: ${skipped}
`);

  if (installed > 0 || updated > 0) {
    log('Payment logos installed successfully!', 'green');
    log(`Use them in your code: <Image src="/${options.outputDir}/visa.svg" alt="Visa" />`, 'dim');
  }
}

function main() {
  const args = process.argv.slice(2);

  // Remove 'init-logos' if present (for npx command)
  const filteredArgs = args.filter(arg => arg !== 'init-logos');

  const options = parseArgs(filteredArgs);

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.list) {
    listLogos();
    process.exit(0);
  }

  installLogos(options);
}

main();
