/**
 * @fileoverview Ensures invoice management is implemented for billing transparency
 * @author AutoQA
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures invoice/billing history page exists for payment transparency',
      category: 'Completeness',
      recommended: true,
    },
    messages: {
      missingInvoicePage: 'Missing /dashboard/invoices page. Users need access to payment history and receipts for compliance.',
      missingInvoiceApi: 'Invoice page exists but missing /api/invoices route. Cannot fetch invoice data from Stripe.',
      invoiceNotLinked: 'Invoice page exists but not linked from billing or dashboard navigation. Users cannot discover it.',
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

        // Only check from billing or dashboard pages
        if (!fileName.includes('app/dashboard/settings/billing') &&
            !fileName.includes('app/dashboard/layout.tsx') &&
            !fileName.includes('app/layout.tsx')) {
          return;
        }

        // Check if Stripe is being used
        const packagePath = path.join(projectRoot, 'package.json');
        if (!fs.existsSync(packagePath)) return;

        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const usesStripe = packageJson.dependencies && packageJson.dependencies.stripe;

        if (!usesStripe) return; // No Stripe, no invoice requirement

        // Check invoice page exists
        const invoicePath = path.join(projectRoot, 'app/dashboard/invoices/page.tsx');
        if (!fs.existsSync(invoicePath)) {
          context.report({
            node,
            messageId: 'missingInvoicePage',
          });
          return;
        }

        // Invoice page exists, check API route
        const invoiceApiPath = path.join(projectRoot, 'app/api/invoices/route.ts');
        if (!fs.existsSync(invoiceApiPath)) {
          context.report({
            node,
            messageId: 'missingInvoiceApi',
          });
        }

        // Check if linked in navigation
        const billingPath = path.join(projectRoot, 'app/dashboard/settings/billing/page.tsx');
        const dashboardLayoutPath = path.join(projectRoot, 'app/dashboard/layout.tsx');

        let isLinked = false;

        if (fs.existsSync(billingPath)) {
          const billingContent = fs.readFileSync(billingPath, 'utf8');
          isLinked = isLinked || billingContent.includes('/invoices') || billingContent.includes('invoice');
        }

        if (fs.existsSync(dashboardLayoutPath)) {
          const layoutContent = fs.readFileSync(dashboardLayoutPath, 'utf8');
          isLinked = isLinked || layoutContent.includes('/invoices') || layoutContent.includes('Invoices');
        }

        if (!isLinked) {
          context.report({
            node,
            messageId: 'invoiceNotLinked',
          });
        }
      },
    };
  },
};
