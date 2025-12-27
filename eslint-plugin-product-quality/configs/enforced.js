/**
 * Enforced configuration for AutoQA ESLint Plugin
 *
 * ALL rules are enforced and CANNOT be overridden by projects.
 * Use this config LAST in your ESLint config array.
 *
 * Projects that override these rules will fail CI validation.
 *
 * New rules added to the plugin are automatically enforced.
 *
 * @version 1.22.0
 */

// Get all rules directly from the rules directory to avoid circular dependency
const fs = require('fs');
const path = require('path');

// Read all rule files from the rules directory
const rulesDir = path.join(__dirname, '../rules');
const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.js'));
const allRuleNames = ruleFiles.map(f => f.replace('.js', ''));

// Generate enforced rules object with all rules as 'error'
const ENFORCED_RULES = {};
for (const ruleName of allRuleNames) {
  ENFORCED_RULES[`product-quality/${ruleName}`] = 'error';
}

// Export the config
module.exports = {
  plugins: ['product-quality'],
  rules: ENFORCED_RULES,
  // Export enforced rule names for validation script
  _enforcedRules: Object.keys(ENFORCED_RULES),
  // Total count for reference
  _totalEnforced: allRuleNames.length,
};
