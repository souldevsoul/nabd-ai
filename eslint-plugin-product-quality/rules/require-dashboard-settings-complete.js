/**
 * @fileoverview Ensures complete user settings pages (profile, billing, account, team)
 * @author AutoQA
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures all user settings pages are implemented for complete account management',
      category: 'Completeness',
      recommended: true,
    },
    messages: {
      missingBillingPage: 'Missing /dashboard/settings/billing page. Users cannot manage subscriptions, credits, or view payment history.',
      missingAccountPage: 'Missing /dashboard/settings/account page. Users cannot manage account settings, delete account, or view connected services.',
      missingProfilePage: 'Missing /dashboard/settings profile/general page. Users cannot update name, avatar, or preferences.',
      missingTeamPage: 'Team/multi-user features exist in pricing but /dashboard/settings/team page is missing.',
      settingsNotInNav: 'Settings pages exist but not linked in dashboard navigation. Users cannot discover settings.',
    },
    schema: [],
  },

  create(context) {
    const projectRoot = context.getCwd();

    let checked = false;

    return {
      Program(node) {
        if (checked) return;
        checked = true;

        const fileName = context.getFilename();

        // Only check from dashboard layout or settings pages
        if (!fileName.includes('app/dashboard/') && !fileName.includes('app/layout.tsx')) {
          return;
        }

        // Check if settings directory exists
        const settingsPath = path.join(projectRoot, 'app/dashboard/settings');
        if (!fs.existsSync(settingsPath)) {
          // No settings at all - this is caught by other rules
          return;
        }

        // Check billing page
        const billingPath = path.join(projectRoot, 'app/dashboard/settings/billing/page.tsx');
        if (!fs.existsSync(billingPath)) {
          context.report({
            node,
            messageId: 'missingBillingPage',
          });
        }

        // Check account page
        const accountPath = path.join(projectRoot, 'app/dashboard/settings/account/page.tsx');
        if (!fs.existsSync(accountPath)) {
          context.report({
            node,
            messageId: 'missingAccountPage',
          });
        }

        // Check main settings/profile page
        const profilePath = path.join(projectRoot, 'app/dashboard/settings/page.tsx');
        if (!fs.existsSync(profilePath)) {
          context.report({
            node,
            messageId: 'missingProfilePage',
          });
        }

        // Check if pricing mentions team but no team settings
        const pricingPath = path.join(projectRoot, 'app/pricing/page.tsx');
        if (fs.existsSync(pricingPath)) {
          const pricingContent = fs.readFileSync(pricingPath, 'utf8');
          const hasTeamFeatures = /team|multi-user|seats|collaborator/i.test(pricingContent);

          if (hasTeamFeatures) {
            const teamPath = path.join(projectRoot, 'app/dashboard/settings/team/page.tsx');
            if (!fs.existsSync(teamPath)) {
              context.report({
                node,
                messageId: 'missingTeamPage',
              });
            }
          }
        }
      },
    };
  },
};
