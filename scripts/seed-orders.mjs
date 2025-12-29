#!/usr/bin/env node
/**
 * Seed sample invoices and credit transactions for testing
 * Run with: DATABASE_URL="..." node scripts/seed-orders.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample invoices and transactions...");

  // Find test users
  const testUsers = await prisma.user.findMany({
    where: {
      email: { startsWith: "test@" },
    },
    take: 5,
  });

  if (testUsers.length === 0) {
    console.log("No test users found. Creating a sample user...");
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        roles: ["BUYER"],
      },
    });
    testUsers.push(user);
  }

  for (const user of testUsers) {
    console.log(`Processing user: ${user.email}`);

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });
    }

    // Create sample invoices
    const invoiceData = [
      {
        invoiceNumber: `INV-${Date.now()}-1`,
        amount: 50.0,
        creditsAmount: 500,
        currency: "EUR",
        status: "PAID",
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        invoiceNumber: `INV-${Date.now()}-2`,
        amount: 100.0,
        creditsAmount: 1000,
        currency: "EUR",
        status: "PAID",
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        invoiceNumber: `INV-${Date.now()}-3`,
        amount: 10.0,
        creditsAmount: 100,
        currency: "EUR",
        status: "PENDING",
        paidAt: null,
      },
    ];

    let totalCredits = 0;

    for (const data of invoiceData) {
      const invoice = await prisma.invoice.create({
        data: {
          userId: user.id,
          paymentId: `payment_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          ...data,
        },
      });

      console.log(`  Created invoice: ${invoice.invoiceNumber} (${invoice.status})`);

      if (invoice.status === "PAID" && invoice.creditsAmount) {
        totalCredits += invoice.creditsAmount;

        // Create credit transaction
        await prisma.creditTransaction.create({
          data: {
            walletId: wallet.id,
            type: "CREDIT_PURCHASE",
            amount: invoice.creditsAmount,
            balance: totalCredits,
            description: `Purchased ${invoice.creditsAmount} credits`,
            paymentId: invoice.paymentId,
            invoiceId: invoice.id,
          },
        });
      }
    }

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance + totalCredits },
    });

    console.log(`  Added ${totalCredits} credits to wallet`);
  }

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
