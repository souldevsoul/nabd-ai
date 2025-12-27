/**
 * AutoQA ESLint Plugin Configurations
 *
 * Available presets:
 * - recommended: Core rules for all SaaS projects
 * - strict: All rules as errors (pre-production)
 * - enforced: Critical rules that cannot be overridden (use LAST in config)
 * - payment-compliance: Payment processor compliance only
 *
 * @version 1.22.0
 */

module.exports = {
  recommended: require('./recommended'),
  strict: require('./strict'),
  enforced: require('./enforced'),
  'payment-compliance': require('./payment-compliance'),
};
